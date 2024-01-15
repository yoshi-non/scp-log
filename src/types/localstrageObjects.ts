export type LocalStorageObjects = {
  id: number;
  name: string;
  movies?: {
    id: string;
    favorite: boolean;
  }[];
}[];
