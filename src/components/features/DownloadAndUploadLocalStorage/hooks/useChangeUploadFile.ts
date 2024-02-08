import { LocalStorageObjects } from '@/types/localstrageObjects';

export const useChangeUploadFile = (
  e: React.ChangeEvent<HTMLInputElement>,
  setUploadFileObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >,
  setIsCheckFile: React.Dispatch<
    React.SetStateAction<boolean>
  >
) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result;
    if (!result) return;
    try {
      const parsedData = JSON.parse(result as string);
      if (parsedData.length === 0) return;
      setUploadFileObjects(parsedData);
      setIsCheckFile(true);
    } catch (error) {
      console.error(error);
      setUploadFileObjects([]);
      setIsCheckFile(false);
      return;
    }
  };
  reader.readAsText(file);
};
