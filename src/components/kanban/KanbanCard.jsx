import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { 
  Edit, 
  Delete, 
  Schedule, 
  Person,
  MoreVert
} from '@mui/icons-material'

function KanbanCard({ item, index, onUpdate, onDelete, onCardClick }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(item)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20'
      case 'medium':
        return 'bg-yellow-500/20'
      case 'low':
        return 'bg-green-500/20'
      default:
        return 'bg-gray-500/20'
    }
  }

  const handleSave = () => {
    onUpdate(item.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(item)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)}일 지남`
    } else if (diffDays === 0) {
      return '오늘'
    } else if (diffDays === 1) {
      return '내일'
    } else {
      return `${diffDays}일 남음`
    }
  }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-md p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden ${
            snapshot.isDragging ? 'rotate-6 ' : 'hover:bg-white/90'
          }`}
          onClick={() => onCardClick && onCardClick(item)}
        >
          {/* 우선순위 배경 */}
          <div className={`absolute inset-0 ${getPriorityColor(item.priority)} backdrop-blur-sm`}></div>
          
          {/* 카드 내용 */}
          <div className="relative z-10">
            {/* 카드 헤더 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full font-medium text-gray-900 bg-white/50 backdrop-blur-sm border border-white/30 px-2 py-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <h4 className="font-medium text-gray-900 line-clamp-2">{item.title}</h4>
                )}
              </div>
              
              {/* 액션 메뉴 */}
              <div className="relative group/menu opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1 hover:bg-white/50 backdrop-blur-sm rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVert className="w-4 h-4 text-gray-500" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white/90 backdrop-blur-md border border-white/20 shadow-lg py-1 opacity-0 group-hover/menu:opacity-100 invisible group-hover/menu:visible transition-all z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(!isEditing);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-white/50 flex items-center gap-2"
                  >
                    <Edit className="w-3 h-3" />
                    편집
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50/50 flex items-center gap-2"
                  >
                    <Delete className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div className="mb-3">
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-sm text-gray-600 bg-white/50 backdrop-blur-sm border border-white/30 px-2 py-1 resize-none"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              )}
            </div>

            {/* 태그 */}
            {/* {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-500/20 text-gray-700 text-xs backdrop-blur-sm border border-gray-200/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )} */}

            {/* 하단 정보 */}
            <div className="flex items-center justify-between text-xs">
              {/* 담당자 */}
              <div className="flex items-center gap-1">
                <Person className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">{item.assignee}</span>
              </div>

              {/* 우선순위 */}
              {/* <div className="flex items-center gap-1">
                {getPriorityIcon(item.priority)}
              </div> */}
            </div>

            {/* 마감일 */}
            {item.dueDate && (
              <div className="flex items-center gap-1 mt-2 text-xs">
                <Schedule className="w-3 h-3 text-gray-500" />
                <span className={`
                  ${new Date(item.dueDate) < new Date() ? 'text-red-600' : 
                    new Date(item.dueDate).toDateString() === new Date().toDateString() ? 'text-orange-600' : 
                    'text-gray-600'}
                `}>
                  {formatDate(item.dueDate)}
                </span>
              </div>
            )}

            {/* 편집 모드 버튼 */}
            {isEditing && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="flex-1 px-3 py-1 bg-blue-600/80 text-white text-sm backdrop-blur-sm hover:bg-blue-700/80 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                  className="flex-1 px-3 py-1 bg-gray-500/20 text-gray-700 text-sm backdrop-blur-sm hover:bg-gray-500/30 transition-colors"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default KanbanCard
