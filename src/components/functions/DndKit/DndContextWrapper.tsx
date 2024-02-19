import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

type Props = {
  children: React.ReactNode;
  sortableContextId: string;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  items: { [key: string]: string[] };
};

const DndContextWrapper = ({
  children,
  sortableContextId,
  handleDragOver,
  handleDragEnd,
  items,
}: Props) => {
  // ドラッグの開始、移動、終了などにどのような入力を許可するかを決めるprops
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        id={sortableContextId}
        items={items.container1}
        strategy={rectSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default DndContextWrapper;
