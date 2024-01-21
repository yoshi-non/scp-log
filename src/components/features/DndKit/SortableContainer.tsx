import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const SortableContainer = ({
  items,
}: {
  items: string[];
}) => {
  return (
    <div className="w-[calc(33%-5px)]">
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((id: string) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </div>
  );
};

export default SortableContainer;
