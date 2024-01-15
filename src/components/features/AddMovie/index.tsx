import { Input } from '@/components/ui/input';

const AddMovie = () => {
  return (
    <div className="w-[70%] mx-auto mt-5">
      <Input type="search" placeholder="動画を検索" />
    </div>
  );
};

export default AddMovie;
