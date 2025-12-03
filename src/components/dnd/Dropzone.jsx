import React from 'react';
import { useDrop } from 'react-dnd';

const Dropzone = ({ onDrop, children }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: () => ({ name: 'Dropzone' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let backgroundColor = '#ffffff';
  if (isActive) {
    backgroundColor = '#e0f2fe';
  } else if (canDrop) {
    backgroundColor = '#f0f9ff';
  }

  return (
    <div
      ref={drop}
      style={{ backgroundColor }}
      className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[400px]"
    >
      {children.length > 0 ? children : <p className="text-center text-gray-500">Arraste os componentes da barra lateral para cá para construir a página.</p>}
    </div>
  );
};

export default Dropzone;