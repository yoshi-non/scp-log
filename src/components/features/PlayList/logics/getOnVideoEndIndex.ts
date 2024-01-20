export const getOnVideoEndIndex = (
  selectedMovieIndex: number,
  movieLength: number
) => {
  const nextMovieIndex =
    selectedMovieIndex === movieLength - 1
      ? 0
      : selectedMovieIndex + 1;
  return nextMovieIndex;
};
