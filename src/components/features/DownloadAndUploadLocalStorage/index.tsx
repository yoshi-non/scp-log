import { Button } from '@/components/ui/button';
import { localStorageKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { localStorageDownload } from '@/components/features/DownloadAndUploadLocalStorage/logics/localStorageDownload';
import { getFromLocalStorage } from '@/utils/storage';
import { useEffect, useState } from 'react';

const DownloadAndUploadLocalStorage = () => {
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects>([]);

  useEffect(() => {
    const storedData = getFromLocalStorage(localStorageKey);
    if (!storedData) return;
    setLocalStorageObjects(storedData);
  }, []);

  const downloadHandler = () => {
    localStorageDownload(localStorageObjects);
  };

  return (
    <div className="mx-20">
      <div className="mt-5">
        <p className="text-xl font-bold">
          バックアップデータとして、JSON形式でダウンロード
          <span className="text-sm text-pretty">
            &nbsp;※出力ファイル名: scp_log_backup_日付.json
          </span>
        </p>
        <p className="text-xs text-primary">
          *API Keyは含まれません。
        </p>
        <Button
          variant="outline"
          onClick={downloadHandler}
          className="mt-3"
        >
          JSONダウンロード
        </Button>
      </div>
    </div>
  );
};

export default DownloadAndUploadLocalStorage;
