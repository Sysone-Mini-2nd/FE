import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import KanbanCard from './KanbanCard'
import { Add, MoreHoriz } from '@mui/icons-material'

function KanbanColumn({ column, onAddCard, onUpdateCard, onDeleteCard, onCardClick }) {
  return (
    <div className="bg-gray-50 border border-gray-200 h-full flex flex-col">
      {/* 컬럼 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${column.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
            <h3 className="font-medium text-gray-900">{column.title}</h3>
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {column.items.length}
            </span>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHoriz className="w-5 h-5" />
          </button>
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
            className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {column.items.map((item, index) => (
              <KanbanCard
                key={item.id}
                item={item}
                index={index}
                onUpdate={onUpdateCard}
                onDelete={onDeleteCard}
                onCardClick={onCardClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default KanbanColumn
