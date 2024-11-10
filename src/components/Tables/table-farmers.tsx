// components/FarmersTable.tsx

import Image from "next/image";
import { useState } from "react";
import { Farmer } from "@/types/farmer";
import { Barangays } from "@/components/constants/barangays";
import DataTable from "react-data-table-component";
import ButtonDefault from "../Buttons/ButtonDefault";
import { Plus } from "lucide-react";
import AddFarmerModal from "../Modals/AddFarmer"; // Assuming the modal component is in /Modals/AddFarmerModal

// Function to get a random barangay
const getRandomBarangay = () => {
  const randomIndex = Math.floor(Math.random() * Barangays.length);
  return Barangays[randomIndex];
};

// Dummy data for farmers
const farmerData: Farmer[] = [
  {
    id: "18273456",
    image: "/images/user/user-01.png",
    name: "Maria Santos",
    age: 45,
    birthday: new Date(1979, 4, 12),
    phone: 1234567890,
    email: 987654321,
    farm_location: getRandomBarangay().name,
    land_size: "2 hectares",
    crops: [
      { name: "Rice", season: "Wet" },
      { name: "Coconut", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 15000,
  },
  {
    id: "781212864",
    image: "/images/user/user-02.png",
    name: "Juan Dela Cruz",
    age: 50,
    birthday: new Date(1974, 6, 22),
    phone: 9876543210,
    email: 654321987,
    farm_location: getRandomBarangay().name,
    land_size: "3 hectares",
    crops: [
      { name: "Bananas", season: "Wet" },
      { name: "Corn", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 20000,
  },
  {
    id: "1828127",
    image: "/images/user/user-03.png",
    name: "Pedro Bautista",
    age: 35,
    birthday: new Date(1989, 9, 10),
    phone: 6543210987,
    email: 543219876,
    farm_location: "Casiguran",
    land_size: "1.5 hectares",
    crops: [
      { name: "Root Crops", season: "Wet" },
      { name: "Citrus Fruits", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 12000,
  },
  {
    id: "1825634",
    image: "/images/user/user-04.png",
    name: "Jose Reyes",
    age: 40,
    birthday: new Date(1984, 11, 3),
    phone: 4321098765,
    email: 321098765,
    farm_location: getRandomBarangay().name,
    land_size: "4 hectares",
    crops: [
      { name: "Coffee", season: "Wet" },
      { name: "Coconut", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 25000,
  },
  {
    id: "1234856",
    image: "/images/user/user-05.png",
    name: "Lucia Gomez",
    age: 30,
    birthday: new Date(1994, 2, 14),
    phone: 2109876543,
    email: 109876543,
    farm_location: getRandomBarangay().name,
    land_size: "1 hectare",
    crops: [
      { name: "Peanuts", season: "Wet" },
      { name: "Abaca", season: "Dry" },
    ],
    farm_owner: true,
    reg_date: new Date(),
    active: true,
    income: 10000,
  },
  // Add more dummy farmers as needed...
];



// Table columns for DataTable
const columns = [
  {
    name: 'Farmer Name',
    selector: (row: Farmer) => row.name,
    sortable: true,
    cell: (row: Farmer) => (
      <div className="flex items-center">
        <Image src={row.image} width={50} height={50} alt={row.name} className="rounded-full mr-2" />
        {row.name}
      </div>
    )
  },
  {
    name: 'Farm Location',
    selector: (row: Farmer) => row.farm_location,
    sortable: true,
  },
  {
    name: 'Land Size',
    selector: (row: Farmer) => row.land_size,
    sortable: true,
  },
  {
    name: 'Crops',
    selector: (row: Farmer) => row.crops.map(crop => crop.name).join(", "),
    sortable: true,
  },
  {
    name: 'Action',
    selector: (row: Farmer) => row.name,
    sortable: true,
    cell: (row: Farmer) => (
      <div className="flex items-center">
        <ButtonDefault
          link={`/dashboard/farmer-management/profile/${row.id.toLowerCase()}`} // Creates a URL-safe ID based on the name
          label={"View"}  
        >
        </ButtonDefault>
      </div>
    ),
  }
];

const FarmersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);

  // Toggle function
  const openAddFarmerModal = () => setIsAddFarmerModalOpen(true);
  const closeAddFarmerModal = () => setIsAddFarmerModalOpen(false);

  // Function to filter farmers based on the search term
  const filteredFarmers = farmerData.filter(farmer => {
    return (
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farm_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.crops.some(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card col-span-12">
      <div className="px-4 py-6 md:px-6 xl:px-9 flex items-center">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white w-1/2">
          Farmers List
        </h4>
        <ul className="flex justify-end gap-2 2xsm:gap-4 w-1/2">
          <ButtonDefault
            label="Add Farmer"
            onClick={openAddFarmerModal}
            customClasses="rounded-full py-3 pl-5 pr-5 bg-green-light text-white focus:border-primary focus:outline-none dark:bg-green dark:text-white dark:focus:border-primary"
          >
            <Plus />
          </ButtonDefault>

          <input
            type="text"
            placeholder="Search..."
            className="rounded-full border border-stroke bg-gray-2 py-3 pl-5 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </ul>
      </div>

      <div className="px-4 pb-6 md:px-6 xl:px-9 flex flex-col items-stretch">
        <DataTable
          columns={columns}
          data={filteredFarmers}
          pagination
          highlightOnHover
          striped
          responsive
          className="rounded-[10px]"
          customStyles={{
            rows: {
              style: {
                fontWeight: '500',
                fontSize: '18px',
                color: 'black',
                backgroundColor: '#F9FAFB',
              },
              highlightOnHoverStyle: {
                backgroundColor: '#E5E7EB',
              },
            },
            headCells: {
              style: {
                backgroundColor: '#fff',
                color: '#000',
                paddingLeft: '10px',
                paddingRight: '10px',
                fontWeight: '700',
                fontSize: '20px',
              },
            },
            cells: {
              style: {
                paddingLeft: '10px',
                paddingRight: '10px',
                padding: '10px',
              },
            },
          }}
        />
      </div>

      {/* Add Farmer Modal */}
      {isAddFarmerModalOpen && (
         <AddFarmerModal onClose={closeAddFarmerModal} />
      )}
    </div>
  );
};

export default FarmersTable;
