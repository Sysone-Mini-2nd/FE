import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import { Add } from '@mui/icons-material';
/** 작성자: 김대호, 백승준 */
function KanbanColumn({ column, onAddCard, onDeleteCard, onCardClick }) {
  const getColumnColor = (id) => {
    switch (id) {
      case 'TODO': return 'bg-gray-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'DONE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 h-full flex flex-col">
      {/* 컬럼 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getColumnColor(column.id)}`}></div>
            <h3 className="font-medium text-gray-900">{column.title}</h3>
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {column.items.length}
            </span>
          </div>
        </div>
        
        <button
            onClick={onAddCard}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors border border-dashed border-gray-300"
        >
          <Add className="w-4 h-4" />
          <span className="text-sm">작업 추가</span>
        </button>
      </div>

      {/* 드롭 영역 */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}>
            {column.items.map((item, index) => (
              <KanbanCard
                key={item.id}
                item={item}
                index={index}
                onDelete={onDeleteCard}
                onCardClick={onCardClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;
