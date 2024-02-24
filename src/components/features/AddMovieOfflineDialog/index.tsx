import { DownloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
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
import { youtubeDownload } from '@/utils/youtubeDownload';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { downloadMp4 } from '@/utils/downloadMp4';

type Props = {
  item: YouTubeSearchResult;
};

const AddMovieOfflineDialog = ({ item }: Props) => {
  const isElectron: boolean =
    process.env.NEXT_PUBLIC_IS_ELECTRON === 'true'
      ? true
      : false;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="mt-5"
        >
          <DownloadIcon />
        </Button>
      </DialogTrigger>
      {isElectron ? (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>オフライン保存</DialogTitle>
            <DialogDescription>
              このPCに動画データ(mp4)を保存します。
              {item.snippet.title}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => downloadMp4(item.id.videoId)}
              >
                保存
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>オフライン保存</DialogTitle>
            <DialogDescription>
              このPCに音声データ(webm)を保存します。
              {item.snippet.title}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() =>
                  youtubeDownload(item.id.videoId)
                }
              >
                保存
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddMovieOfflineDialog;
