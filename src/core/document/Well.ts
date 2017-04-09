export interface Well {
  id: string;
  selected: boolean;
  hovered: boolean;
  x: number;
  y: number;
  radius: number;
  [columnId: string]: any;
}