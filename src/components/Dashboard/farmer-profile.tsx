"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Edit, Pencil, X, Trash2, Calendar, Phone, MapPin, Coins, User, IdCard, Cake, Printer, GitPullRequest, HandHelping  } from "lucide-react";
import { Farmer } from "@/types/farmer";
import { usePathname } from "next/navigation";
import AddFarmerModal from "../Modals/AddFarmer";
import FarmPhotosModal from "../Modals/FarmPhotosModal";
import { toast } from "react-toastify";
import EditFarmerModal from "../Modals/EditFarmerModal";
import AidRequest from "../Modals/AidRequest";

interface FarmerProfileProps {
  farmer: Farmer;
}

interface FarmPhoto {
  id: number;
  photo_url: string;
  created_at: string;
}

interface AidReceived {
  id: number;
  aid_program_id: number;
  farmer_id: number;
  quantity_received: string;
  distribution_date: string;
  status: string;
  remarks: string;
  created_at: string;
  program_name: string;
  program_category: string;
  resource_allocation: number;
  farmer_name: string;
  farm_location: string;
}

interface AidRequested {
  id: number;
  farmer_id: string;
  program_name: string;
  category: string;
  req_note: string;
  status: string;
  distribution_date: string;
  request_date: string;

}

const FarmerProfile: React.FC<FarmerProfileProps> = ({ farmer }) => {
  const pathname = usePathname();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAidRequestModalOpen, setIsAidRequestModalOpen] = useState(false);

  const [farmPhotos, setFarmPhotos] = useState<FarmPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<FarmPhoto | null>(null);
  const [aidReceived, setAidReceived] = useState<AidReceived[]>([]);
  const [aidRequests, setAidRequests] = useState<AidRequested[]>([]);
  const [isLoadingAid, setIsLoadingAid] = useState(true);
  const [isLoadingAidReq, setIsLoadingAidReq] = useState(true);

  const fetchFarmPhotos = async () => {
    try {
      const response = await fetch(`/api/farmers/${farmer.id}/photos`);
      if (!response.ok) throw new Error('Failed to fetch photos');
      const data = await response.json();
      setFarmPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching farm photos:', error);
      toast.error('Failed to load farm photos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAidReceived = async () => {
    try {
      const response = await fetch(`/api/farmers/${farmer.id}/aid-records`);
      if (!response.ok) throw new Error('Failed to fetch aid records');
      const data = await response.json();
      setAidReceived(data.records || []);
    } catch (error) {
      console.error('Error fetching aid records:', error);
      toast.error('Failed to load aid records');
      setAidReceived([]);
    } finally {
      setIsLoadingAid(false);
    }
  };

  const fetchAidRequests = async () => {
    try {
      const response = await fetch(`/api/aid-requests?farmer_id=${farmer.id}`);
      if (!response.ok) throw new Error('Failed to fetch aid requests');
      const data = await response.json();
      setAidRequests(data || []);
    } catch (error) {
      console.error('Error fetching aid requests:', error);
      toast.error('Failed to load aid requests');
      setAidRequests([]);
    } finally {
      setIsLoadingAidReq(false);
    }
  };

  useEffect(() => {
    fetchFarmPhotos();
    fetchAidReceived();
    fetchAidRequests();
  }, [farmer.id]);

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/farmers/${farmer.id}/photos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId }),
      });

      if (!response.ok) throw new Error('Failed to delete photo');

      toast.success('Photo deleted successfully');
      fetchFarmPhotos();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Ensure image path has leading slash
  const farmerImage = farmer.image?.startsWith('/') ? farmer.image : '/images/user/default-user.png';

  // Lightbox component
  const Lightbox = () => {
    if (!selectedPhoto) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90">
        <div className="relative max-h-[90vh] max-w-[90vw]">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute -right-12 -top-12 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
          <div className="relative">
            <Image
              src={selectedPhoto.photo_url}
              alt="Farm photo"
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <button
              onClick={() => handleDeletePhoto(selectedPhoto.id)}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              <Trash2 size={20} />
              <span>Delete Photo</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Create the ID card HTML
    const idCardHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Farmer ID Card - ${farmer.name}</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }
              .id-card {
                width: 3.375in;
                height: 2.125in;
                padding: 20px;
                border: 1px solid #000;
                margin: 20px auto;
                position: relative;
                background: white;
              }
              .header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              .header h1 {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
              }
              .header h2 {
                margin: 5px 0;
                font-size: 12px;
              }
              .content {
                display: flex;
                gap: 15px;
              }
              .photo {
                width: 100px;
                height: 100px;
                border: 1px solid #000;
              }
              .details {
                flex: 1;
                font-size: 10px;
              }
              .details p {
                margin: 3px 0;
              }
              .footer {
                position: absolute;
                bottom: 10px;
                left: 20px;
                right: 20px;
                text-align: center;
                font-size: 6px;
              }
              .qr-code {
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                border: 1px solid #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="header">
              <h1>FARMER IDENTIFICATION CARD</h1>
              <h2>Municipality of San Luis</h2>
            </div>
            <div class="content">
              <div>
              <img src="${farmer.image || '/images/user/default-user.png'}" class="photo" alt="Farmer Photo">
              <p style="font-size: 10px;"><strong>ID #:</strong> ${farmer.id}</p>
              </div>
              <div class="details">
                <p><strong>Username:</strong> ${farmer.username}</p>
                <p><strong>Name:</strong> ${farmer.name}</p>
                <p><strong>Birthday:</strong> ${formatDate(farmer.birthday)}</p>
                <p><strong>Gender:</strong> ${
                  {
                    M: 'Male',
                    F: 'Female',
                    Other: 'LGBTQ+',
                  }[farmer.gender as 'M' | 'F' | 'Other'] || 'Unknown'
                }</p>
                <p><strong>Contact:</strong> ${farmer.phone || 'Not provided'}</p>
                <p><strong>Barangay:</strong> ${farmer.farm_location}</p>
              </div>
            </div>
            <div class="footer">
              This card is the property of the Municipality of San Luis. If found, please return to the Municipal Hall.
            </div>
            
          </div>
        </body>
      </html>
    `;

    // Write the HTML to the new window and print
    printWindow.document.write(idCardHtml);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  //console.log(farmer);

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-100 rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div className="px-10 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div className="relative z-30 mx-auto -mt-14 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-cover bg-center">
          <Image
            src={farmerImage}
            alt={farmer.name}
            className="object-cover"
            width={120}
            height={120}
            style={{
              width: "100%",
              height: "100%",
            }}
          />

        </div>
      <div className="flex flex-col items-center justify-center">
        <h4 className="mt-2 text-3xl text-black dark:text-white font-bold">
          {farmer.name}
        </h4>
        <h6 className="text-lg text-gray-500 dark:text-gray-400">({farmer.username})</h6>
        
        {/* Farmer Type Tags */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {Array.isArray(farmer.farmer_type) && farmer.farmer_type.length > 0 ? (
            farmer.farmer_type.map((type, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full"
              >
                {type}
              </span>
            ))
          ) : (
            <span className="inline-block px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 rounded-full">
              Farmer Type not specified
            </span>
          )}
        </div>
      </div>
        
        {/* Edit and Print Buttons */}
        <div className="mt-6 w-full flex justify-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-fit flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary dark:bg-primary-dark px-4 py-2 text-body-sm font-medium text-white hover:bg-opacity-90"
          >
            <Pencil size={20}/>
            <span>Edit Info</span>
          </button>
          <button
            onClick={handlePrint}
            className="w-fit flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-blue-light dark:bg-blue-dark px-4 py-2 text-body-sm font-medium text-white hover:bg-opacity-90"
          >
            <Printer size={20}/>
            <span>Print ID</span>
          </button>
        </div>

        {/* Basic Information */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="flex items-center justify-center gap-2">
            <Cake className="h-5 w-5 text-primary" />
            <span className="text-sm text-body-light dark:text-body-dark">
              {formatDate(farmer.birthday)} 
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm text-body-light dark:text-body-dark">
              {farmer.age} years old
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-sm text-body-light dark:text-body-dark">
              {{
                M: 'Male',
                F: 'Female',
                Other: 'LGBTQ+',
              }[farmer.gender as 'M' | 'F' | 'Other'] || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-sm text-body-light dark:text-body-dark">
              {farmer.phone || 'Not provided'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm text-body-light dark:text-body-dark">
              {farmer.farm_location}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <IdCard className="h-5 w-5 text-primary" />
            <span className="text-sm text-body-light dark:text-body-dark">
              {farmer.id}
            </span>
          </div>
        </div>

        {/* Farm Information */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Land Size</h5>
            <p className="text-lg font-bold text-primary">{farmer.land_size}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Farm Ownership</h5>
            <p className="text-lg font-bold text-primary">{farmer.farm_ownership_type || 'Not specified'}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Annual Income</h5>
            <p className="text-lg font-bold text-primary">₱{parseInt(farmer.income.toString()).toLocaleString('en-US')}</p>
          </div>
        </div>

        {/* Crops Section */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Wet Season Crops Card */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800 text-center">
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Wet Season Crops
            </h5>
            <div className="flex flex-wrap gap-2">
              {farmer.crops
                .filter((crop) => crop.season.toLowerCase() === "wet")
                .map((crop, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                  >
                    {crop.name}
                  </span>
                ))}
              {farmer.crops.filter((crop) => crop.season.toLowerCase() === "wet").length === 0 && (
                <span className="text-gray-500 dark:text-gray-400">No wet season crops</span>
              )}
            </div>
          </div>

          {/* Dry Season Crops Card */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Dry Season Crops
            </h5>
            <div className="flex flex-wrap gap-2">
              {farmer.crops
                .filter((crop) => crop.season.toLowerCase() === "dry")
                .map((crop, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                  >
                    {crop.name}
                  </span>
                ))}
              {farmer.crops.filter((crop) => crop.season.toLowerCase() === "dry").length === 0 && (
                <span className="text-gray-500 dark:text-gray-400">No dry season crops</span>
              )}
            </div>
          </div>
        </div>





        {/* Farm Photos Section */}

        <div className="mt-6 flex justify-between items-center mb-6">
          <h2 className="text-3xl text-black dark:text-white font-bold text-left">Farm Photos</h2>
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            <Camera size={20} />
            <span>Add Photos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square animate-pulse"
              />
            ))
          ) : farmPhotos.length > 0 ? (
            farmPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.photo_url}
                  alt="Farm photo"
                  width={300}
                  height={300}
                  className="w-full aspect-square object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-300">
                  <span className="text-white font-medium">View Photo</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No farm photos uploaded yet
            </div>
          )}
        </div>
        
        {/* Aid Received Section */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-left">Aid Requests</h2>
          <button
            onClick={() => setIsAidRequestModalOpen(true)}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            <HandHelping size={20} />
            <span>Request Aid</span>
          </button>
          </div>
          {isLoadingAidReq ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (aidRequests && aidRequests.length > 0) ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request Note</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aid Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distribution Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {aidRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-left">{req.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-left">{req.req_note}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {req.program_name ? req.program_name : "PENDING"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{req.distribution_date ? formatDate(req.distribution_date): "PENDING"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(req.request_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${req.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No aid requests found</p>
          )}
        </div>

        {/* Aid Received Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-left">Aid Received</h2>
          {isLoadingAid ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (aidReceived && aidReceived.length > 0) ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Program Name</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distribution Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {aidReceived.map((aid) => (
                    <tr key={aid.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-left">{aid.program_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{aid.program_category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {aid.program_category === 'Financial Assistance'
                          ? `₱${parseInt(aid.quantity_received.substring(1) as unknown as string).toLocaleString()}`
                          : `${aid.quantity_received}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(aid.distribution_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${aid.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            aid.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                          {aid.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No aid records found</p>
          )}
        </div>
      </div>

      {selectedPhoto && <Lightbox />}

      {isEditModalOpen && (
        <EditFarmerModal
          farmer={farmer}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isAidRequestModalOpen && (
        <AidRequest
          farmerID={farmer.id}
          onSuccess={fetchAidRequests}
          onClose={() => setIsAidRequestModalOpen(false)}
        />
      )}

      {isPhotoModalOpen && (
        <FarmPhotosModal
          farmerId={farmer.id}
          onClose={() => setIsPhotoModalOpen(false)}
          onPhotosUpdated={fetchFarmPhotos}
        />
      )}
    </div>
  );
};

export default FarmerProfile;
