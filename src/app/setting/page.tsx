'use client';

import DeleteLocalStorage from '@/components/features/DeleteLocalStorage';
import DownloadAndUploadLocalStorage from '@/components/features/DownloadAndUploadLocalStorage';
import InputKey from '@/components/features/InputKey';
import { useLSPlaylists } from '@/usecases/useLSPlaylists';

const Setting = () => {
  const { lsPlaylists, updateLSPlaylists } =
    useLSPlaylists();

  return (
    <div>
      <InputKey />
      <DownloadAndUploadLocalStorage
        lsPlaylists={lsPlaylists}
        updateLSPlaylists={updateLSPlaylists}
      />
      <DeleteLocalStorage
        updateLSPlaylists={updateLSPlaylists}
      />
    </div>
  );
};

export default Setting;
