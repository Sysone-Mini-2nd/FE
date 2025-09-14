import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { 
  Edit, 
  Delete, 
  Schedule, 
  Person,
  MoreVert
} from '@mui/icons-material';

function KanbanCard({ item, index, onCardClick, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500/20';
      case 'NORMAL': return 'bg-yellow-500/20';
      case 'LOW': return 'bg-green-500/20';
      case 'WARNING': return 'bg-orange-500/20'; // 긴급(WARNING) 상태 추가
      default: return 'bg-gray-500/20';
    }
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(item.id);
    setIsMenuOpen(false);
  };

  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onCardClick(item)}
          className={`rounded-md p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden ${snapshot.isDragging ? 'rotate-3 shadow-2xl' : 'hover:bg-white/90'}`}>
          
          <div className={`absolute inset-0 ${getPriorityColor(item.priority)} backdrop-blur-sm`}></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-gray-900 line-clamp-2 pr-4">{item.title}</h4>
              
              <div className="relative">
                <button 
                  className="p-1 hover:bg-white/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleMenuToggle}>
                  <MoreVert className="w-4 h-4 text-gray-500" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white/90 backdrop-blur-md border border-white/20 shadow-lg py-1 z-20 rounded-md">
                    <button 
                      // onClick={handleEditClick} // 편집 기능은 추후 구현
                      className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100/50 flex items-center gap-2 disabled:opacity-50" disabled>
                      <Edit className="w-3 h-3" />
                      편집
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50/50 flex items-center gap-2">
                      <Delete className="w-3 h-3" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.desc}</p>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Person className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">{item.memberName || '미지정'}</span>
              </div>
              {item.dDay !== null && (
                <div className="flex items-center gap-1">
                  <Schedule className="w-3 h-3 text-gray-500" />
                  <span className={`${item.dDay < 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    {item.dDay < 0 ? `D+${Math.abs(item.dDay)}` : `D-${item.dDay}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default KanbanCard;
