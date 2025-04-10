import { Crops } from "./crops";

export interface Farmer {
  id: string;
  username: string;
  image: string;
  name: string;
  age: number;
  gender: string;
  birthday: string;
  phone: string;
  email: string;
  farm_location: string;
  land_size: string;
  farm_owner: boolean;
  farm_ownership_type: string;
  farmer_type: string[];
  reg_date: string;
  active: boolean;
  income: number;
  family_members: number;
  aid_requested?: string;
  status?: any;
  distribution_date?: string;
  identification_no?: string;
  remarks?: string;
  crops: Array<{
    name: string;
    season: string;
  }>;
}
  