import { Button } from '@/components/ui/button';
import { localStorageKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { localStorageDownload } from '@/components/features/DownloadAndUploadLocalStorage/logics/localStorageDownload';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utils/storage';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const DownloadAndUploadLocalStorage = () => {
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects>([]);
  const [uploadFileObjects, setUploadFileObjects] =
    useState<LocalStorageObjects>([]);

  useEffect(() => {
    const storedData = getFromLocalStorage(localStorageKey);
    if (!storedData) return;
    setLocalStorageObjects(storedData);
  }, []);

  const downloadHandler = () => {
    localStorageDownload(localStorageObjects);
  };

  const changeUploadFile = (
    e: React.ChangeEvent<HTMLInputElement>
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
      } catch (error) {
        console.error(error);
        toast.error(`ファイルが規定の形式ではありません。`);
        setUploadFileObjects([]);
        return;
      }
    };
    reader.readAsText(file);
  };

  const uploadHandler = () => {
    saveToLocalStorage(localStorageKey, uploadFileObjects);
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
          ダウンロード
        </Button>
      </div>

      <div className="mt-5">
        <p className="text-xl font-bold">
          バックアップデータをアップロード
        </p>
        <input
          type="file"
          accept=".json"
          onChange={(e) => changeUploadFile(e)}
        />
        <Button
          disabled={uploadFileObjects.length === 0}
          variant="outline"
          onClick={uploadHandler}
          className="mt-3"
        >
          アップロード
        </Button>
      </div>
    </div>
  );
};

export default DownloadAndUploadLocalStorage;
