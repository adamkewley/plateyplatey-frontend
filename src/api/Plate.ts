import {PlateArrangement} from "./PlateArrangement";
import {PlateWell} from "./PlateWell";
import {PlateWellSelector} from "./PlateWellSelector";

export interface Plate {
  name: String;
  gridWidth: number;
  gridHeight: number;
  selectors: PlateWellSelector[];
  wells: PlateWell[];
  wellRadius: number;
  arrangements: PlateArrangement[];
}