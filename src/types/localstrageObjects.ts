export type LocalStorageObjects = {
  name: string;
  movies: {
    id: string;
    title: string;
    // channel: string;
    thumbnail: string;
    favorite: boolean;
  }[];
}[];
