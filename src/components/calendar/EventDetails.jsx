import React from 'react'
import dayjs from 'dayjs'

const EventDetails = ({ selectedDate, events, onEventAction }) => {
  const formatDate = (date) => {
    return dayjs(date).format('YYYY.MM.DD')
  }

  const getEventTypeLabel = (type) => {
    const typeLabels = {
      submission: '제출',
      meeting: '회의',
      task: '작업',
      review: '검토',
      default: '일정'
    }
    return typeLabels[type] || typeLabels.default
  }

  const getEventTypeColor = (type) => {
    const typeColors = {
      submission: '#ff9f9f',
      meeting: '#9f9fff',
      task: '#ffdf9f',
      review: '#9fffdf',
      default: '#3174ad'
    }
    return typeColors[type] || typeColors.default
  }

  const handleEventAction = (eventId, action) => {
    onEventAction && onEventAction(eventId, action)
  }

  return (
    <div className="bg-white rounded-lg p-4 min-h-[620px]">
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 m-0">
          {selectedDate ? formatDate(selectedDate) : formatDate(new Date())}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {events && events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-center mb-3">
                <div 
                  className="inline-block px-2 py-1 rounded-xl text-xs font-medium text-white uppercase"
                  style={{ backgroundColor: getEventTypeColor(event.type) }}
                >
                  {getEventTypeLabel(event.type)}
                </div>
              </div>
              
              <h4 className="text-base font-semibold text-gray-900 mb-2 leading-normal">{event.title}</h4>
              
              {event.description && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{event.description}</p>
              )}
              
              {event.assignee && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-600">담당자:</span>
                  <span className="text-xs text-gray-900">{event.assignee}</span>
                </div>
              )}
              
              {event.priority && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-600">우선순위:</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-lg uppercase ${
                    event.priority === 'high' ? 'bg-red-100 text-red-700' :
                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {event.priority === 'high' ? '높음' : 
                     event.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                </div>
              )}
              
              <div className="mb-3 p-2.5 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">시작:</span>
                  <span className="text-xs text-gray-900">
                    {dayjs(event.start).format('YYYY.MM.DD HH:mm')}
                  </span>
                </div>
                
                {event.end && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">종료:</span>
                    <span className="text-xs text-gray-900">
                      {dayjs(event.end).format('YYYY.MM.DD HH:mm')}
                    </span>
                  </div>
                )}
              </div>

              {event.status && (
                <div className="mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-xl uppercase ${
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    event.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {event.status === 'pending' ? '대기 중' :
                     event.status === 'in-progress' ? '진행 중' : '완료'}
                  </span>
                </div>
              )}

              {event.actions && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  {event.actions.map(action => (
                    <button
                      key={action.type}
                      className={`px-3 py-1.5 border rounded text-xs font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                        action.type === 'cancel' ? 'text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-600' :
                        action.type === 'confirm' ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600' :
                        action.type === 'edit' ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600' :
                        action.type === 'delete' ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600' :
                        'bg-white text-gray-600 border-gray-300'
                      }`}
                      onClick={() => handleEventAction(event.id, action.type)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 px-5 text-gray-500">
            <p className="text-sm italic m-0">선택된 날짜에 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetails
