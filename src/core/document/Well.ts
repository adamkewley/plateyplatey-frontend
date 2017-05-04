import { WellData } from "./WellData";

export interface Well {
  id: string;
  selected: boolean;
  hovered: boolean;
  x: number;
  y: number;
  radius: number;
  data: { [columnId: string]: WellData }
} 