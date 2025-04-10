'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Barangays } from '@/components/constants/barangays';

const cropsList = [
  "Wheat", "Rice", "Corn", "Soybean", "Coconut", "Banana", "Pineapple", "Mango",
  "Sugarcane", "Coffee", "Cacao", "Abaca", "Cassava", "Sweet Potato", "Onion",
  "Garlic", "Tomato", "Eggplant", "Chili Pepper", "Calamansi", "Guava", "Papaya",
  "Avocado", "Durian", "Rambutan", "Lanzones", "Watermelon", "Muskmelon", "Cabbage",
  "Cauliflower", "Broccoli", "Lettuce", "Spinach", "Pechay", "Mung Bean", "Sitao",
  "Okra", "Kangkong", "Petchay", "Upo", "Labanos", "Kamote", "Sayote", "Talong",
  "Ampalaya", "Sitaw", "Patola", "Kundol", "Malunggay"
];

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <label className="mb-2.5 block font-medium text-black dark:text-white">
    {text} <span className="text-red-500">*</span>
  </label>
);

interface FarmerFormData {
  name: string;
  birthday: string;
  age: number;
  gender: string;
  contact_number: string;
  farm_location: string;
  farm_owner: string;
  land_size: string;
  income: number;
  image?: File | string;
  wetSeasonCrops: string[];
  drySeasonCrops: string[];
  farm_ownership_type: string;
  farmer_type: string[];
}

const farmerTypes = [
  'Coconut Farmer',
  'Rice Farmer',
  'Fruit & Vegetables',
  'Poultry Farmers'
];

const SignupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FarmerFormData>({
    name: "",
    birthday: "",
    age: 0,
    gender: "",
    contact_number: "",
    farm_location: "",
    farm_owner: "",
    land_size: "",
    income: 0,
    wetSeasonCrops: [],
    drySeasonCrops: [],
    farm_ownership_type: "",
    farmer_type: []
  });

  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [wetCropInput, setWetCropInput] = useState("");
  const [dryCropInput, setDryCropInput] = useState("");
  const [wetSuggestions, setWetSuggestions] = useState<string[]>([]);
  const [drySuggestions, setDrySuggestions] = useState<string[]>([]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'birthday') {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        age: age
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    try {
      setIsUploading(true);
      const objectUrl = URL.createObjectURL(file);
      setImageBlob(objectUrl);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        image: data.path
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setFormData(prev => ({
        ...prev,
        image: '/images/user/default-user.png'
      }));
      setImageBlob(null);
    } finally {
      setIsUploading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedData = {
        name: formData.name,
        image: formData.image || '/images/user/default-user.png',
        age: parseInt(formData.age.toString()),
        birthday: new Date(formData.birthday),
        gender: formData.gender,
        phone: formData.contact_number,
        farm_location: formData.farm_location,
        land_size: formData.land_size,
        farm_owner: formData.farm_owner === 'true',
        income: parseFloat(formData.income.toString()),
        farmOwnerClassification: formData.farm_ownership_type,
        farmerType: formData.farmer_type
      };

      const response = await fetch('/api/farmer/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      console.log(formattedData);
      console.log(response);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sign up');
      }

      const data = await response.json();
      toast.success('Registration successful! Please wait for admin approval.');
      router.push(`/farmer/success?username=${data.farmer_details.username}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const imageSrc = imageBlob || formData.image || '/images/user/default-user.png';

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Image
            width={80}
            height={80}
            src="/images/logo/logo-circle.png"
            alt="Logo"
            priority
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Farmer Registration
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Fill out the form below to register as a farmer
          </p>
        </div>

        {/* Registration Form */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-dark rounded-lg shadow-default p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="mb-6">
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <Image
                    src={imageSrc}
                    alt="Farmer Image"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Farmer Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Name & Gender Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Name" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <RequiredLabel text="Gender" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">LGBTQ+</option>
                </select>
              </div>
            </div>

            {/* Birthday & Age Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Birthday" />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <RequiredLabel text="Age" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            {/* Contact & Farm Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Contact Number" />
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <RequiredLabel text="Farm Location" />
                <select
                  name="farm_location"
                  value={formData.farm_location}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Barangay</option>
                  {Barangays.map((barangay) => (
                    <option key={barangay.code} value={barangay.name}>
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farm Owner & Land Size Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Land Size" />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="land_size"
                    value={formData.land_size.split(' ')[0]}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        land_size: `${e.target.value} ${prev.land_size.split(' ')[1] || 'ha'}`
                      }));
                    }}
                    required
                    className="w-2/3 rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  />
                  <select
                    value={formData.land_size.split(' ')[1] || 'ha'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        land_size: `${prev.land_size.split(' ')[0]} ${e.target.value}`
                      }));
                    }}
                    className="w-1/3 rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  >
                    <option value="ha">Hectares</option>
                    <option value="sqm">Square Meters</option>
                    <option value="acre">Acres</option>
                  </select>
                </div>
              </div>
              <div>
                <RequiredLabel text="Income" />
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  placeholder="Enter annual income"
                />
              </div>
            </div>




            {/* Farm Ownership Type & Farmer Type Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Farm Ownership Type" />
                <select
                  name="farm_ownership_type"
                  value={formData.farm_ownership_type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  >Select Ownership Type</option>
                  <option value="Land Owner" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  >Land Owner</option>
                  <option value="Tenant" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  >Tenant</option>
                </select>
              </div>

              <div>
                <RequiredLabel text="Farmer Type" />
                <div className="space-y-2">
                  {farmerTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`farmer-type-${type}`}
                        checked={formData.farmer_type.includes(type)}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...formData.farmer_type, type]
                            : formData.farmer_type.filter((t) => t !== type);
                          setFormData({ ...formData, farmer_type: updatedTypes });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`farmer-type-${type}`} className="text-sm text-black dark:text-white">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary py-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 