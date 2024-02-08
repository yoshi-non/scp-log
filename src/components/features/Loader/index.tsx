import { cn } from '@/libs/utils';
import { Loader2 } from 'lucide-react';

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex items-center text-primary',
        className
      )}
    >
      <Loader2 className="h-16 w-16 animate-spin" />
      <p className="text-3xl">Loading...</p>
    </div>
  );
};

export default Loader;
