import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ id, type, name, icon: Icon, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { id, type, name, icon: Icon },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      ref={drag}
      style={{ opacity }}
      className="p-2 mb-2 bg-gray-100 border rounded-lg cursor-move flex items-center hover:bg-blue-100"
    >
      {Icon && <Icon className="mr-2 h-4 w-4 text-gray-600" />}
      <span className="text-sm">{name}</span>
    </div>
  );
};

export default DraggableItem;