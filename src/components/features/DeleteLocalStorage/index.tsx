import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { localStorageKey } from '@/constants/localStorageKey';
import { saveToLocalStorage } from '@/utils/storage';

const DeleteLocalStorage = () => {
  const deleteAllLocalStorageHandler = () => {
    saveToLocalStorage(localStorageKey, []);
  };
  return (
    <div className="mx-20">
      <p className="mt-5 text-xl font-bold">
        ローカルストレージのデータを全て削除
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="mt-3">全データ削除</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              プレイリストの全データは削除されます。
              <br />
              よろしいですか？
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAllLocalStorageHandler}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteLocalStorage;
