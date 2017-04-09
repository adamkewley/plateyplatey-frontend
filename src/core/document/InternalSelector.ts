import {Well} from "./Well";

export interface InternalSelector {
  x: number;
  y: number;
  label: string;
  selects: Well[];
}