export type LocalStorageObjects = {
  name: string;
  movies: {
    id: string;
    title: string;
    thumbnail: string;
    favorite: boolean;
  }[];
}[];
