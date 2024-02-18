export type LocalStorageObjects = {
  name: string;
  movies: {
    id: string;
    title: string;
    thumbnail: string;
    favorite: boolean;
  }[];
}[];

export type Movies = {
  id: string;
  title: string;
  thumbnail: string;
  favorite: boolean;
}[];

export type Movie = {
  id: string;
  title: string;
  thumbnail: string;
  favorite: boolean;
};
