import { Crops } from "./crops";

export type Farmer = {
    id: string,
    image: string;
    name: string;
    age: number;
    gender?: string;
    birthday: Date;
    phone?: number;
    email?: number;
    farm_location: string;
    land_size: string;
    crops: Crops[];
    farm_owner: boolean;
    reg_date: Date;
    active: boolean;
    income: number;
  };
  