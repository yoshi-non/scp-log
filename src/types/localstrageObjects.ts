export type LocalStorageObjects = {
  id: string;
  name: string;
  tags?: string[];
  movies?: {
    id: string;
    favarite: boolean;
  }[];
}[];
