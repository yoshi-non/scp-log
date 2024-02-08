'use client';

import DeleteLocalStorage from '@/components/features/DeleteLocalStorage';
import DownloadAndUploadLocalStorage from '@/components/features/DownloadAndUploadLocalStorage';
import InputKey from '@/components/features/InputKey';

const Setting = () => {
  return (
    <div>
      <InputKey />
      <DownloadAndUploadLocalStorage />
      <DeleteLocalStorage />
    </div>
  );
};

export default Setting;
