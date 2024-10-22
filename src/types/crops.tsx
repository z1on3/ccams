import { Farmer } from "./farmer";

export type Crops = {
    name: string;
    owner?: Farmer["name"];
    season: string;
  };
  