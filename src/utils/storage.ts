import { LocalStorageObjects } from '@/types/localstrageObjects';

export const saveToLocalStorage = (
  key: string,
  data: LocalStorageObjects | string
) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const updateLocalStorage = (
  key: string,
  newData: LocalStorageObjects
) => {
  try {
    // Get existing data from localStorage
    const existingData = localStorage.getItem(key);

    if (existingData) {
      // Parse existing data
      const parsedData: LocalStorageObjects =
        JSON.parse(existingData);

      // Merge existing data with new data
      const updatedData: LocalStorageObjects = [
        ...parsedData,
        ...newData,
      ];

      // Save updated data to localStorage
      localStorage.setItem(
        key,
        JSON.stringify(updatedData)
      );
    } else {
      // If no existing data, save the new data directly
      saveToLocalStorage(
        key,
        newData as LocalStorageObjects
      );
    }
  } catch (error) {
    console.error('Error updating localStorage:', error);
  }
};

export const getFromLocalStorage = (
  key: string
): LocalStorageObjects | false => {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return false;
    return JSON.parse(storedData) as LocalStorageObjects;
  } catch (error) {
    console.error(
      'Error getting data from localStorage:',
      error
    );
    return false;
  }
};

export const getFromLocalStorageInputKey = (
  key: string
): string | false => {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData || storedData === '') return false;
    return JSON.parse(storedData) as string;
  } catch (error) {
    console.error(
      'Error getting data from localStorage:',
      error
    );
    return false;
  }
};
