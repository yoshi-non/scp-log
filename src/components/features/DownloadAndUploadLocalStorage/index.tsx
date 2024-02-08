import { Button } from '@/components/ui/button';
import { localStorageKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { localStorageDownload } from '@/components/features/DownloadAndUploadLocalStorage/logics/localStorageDownload';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utils/storage';
import { useEffect, useState } from 'react';
import { useChangeUploadFile } from './hooks/useChangeUploadFile';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const DownloadAndUploadLocalStorage = () => {
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects>([]);
  const [uploadFileObjects, setUploadFileObjects] =
    useState<LocalStorageObjects>([]);
  const [isCheckFile, setIsCheckFile] =
    useState<boolean>(true);

  useEffect(() => {
    const storedData = getFromLocalStorage(localStorageKey);
    if (!storedData) return;
    setLocalStorageObjects(storedData);
  }, []);

  const downloadHandler = () => {
    localStorageDownload(localStorageObjects);
  };

  const uploadHandler = () => {
    saveToLocalStorage(localStorageKey, uploadFileObjects);
  };

  const UploadFileHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    useChangeUploadFile(
      e,
      setUploadFileObjects,
      setIsCheckFile
    );
  };

  const addUploadHandler = () => {
    const newLocalStorageObjects = [
      ...localStorageObjects,
      ...uploadFileObjects,
    ];
    saveToLocalStorage(
      localStorageKey,
      newLocalStorageObjects
    );
    setLocalStorageObjects(newLocalStorageObjects);
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
        <div>
          <p className="text-xl font-bold">
            バックアップデータをアップロード
          </p>
          <input
            type="file"
            accept=".json"
            onChange={(e) => UploadFileHandler(e)}
          />
          {!isCheckFile && (
            <p className=" text-xs text-primary">
              ファイルが規定の形式ではありません。
            </p>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={uploadFileObjects.length === 0}
              variant="outline"
              className="mt-3"
            >
              アップロード
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                バックアップデータをアップロード
              </DialogTitle>
              <DialogDescription>
                新規データとして追加するか全てのデータを上書きするか選択してください。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <div className="w-full flex justify-center gap-10">
                  <Button
                    disabled={
                      uploadFileObjects.length === 0
                    }
                    variant="outline"
                    onClick={addUploadHandler}
                    className="mt-3"
                  >
                    新規に追加
                  </Button>
                  <Button
                    disabled={
                      uploadFileObjects.length === 0
                    }
                    variant="destructive"
                    onClick={uploadHandler}
                    className="mt-3"
                  >
                    全て上書き
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DownloadAndUploadLocalStorage;
