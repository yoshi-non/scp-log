import { useState } from 'react';

export const useMasked = () => {
  const [isMasked, setIsMasked] = useState<boolean>(true);

  const changeMaskHandler = () => {
    if (!isMasked) {
      setIsMasked(true);
    } else {
      setIsMasked(false);
    }
  };

  return {
    isMasked,
    changeMaskHandler,
  };
};
