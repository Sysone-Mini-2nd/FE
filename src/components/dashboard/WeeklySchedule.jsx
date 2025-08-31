import React from 'react'

function WeeklySchedule() {

  //예시 데이터
  const today = new Date();
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  
  const scheduleItems = [
    { time: '09:00', title: '팀 스탠드업 미팅', type: 'meeting' },
    { time: '14:00', title: 'UI 디자인 리뷰', type: 'review' },
    { time: '16:30', title: '클라이언트 미팅', type: 'meeting' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 주 일정</h3>
      
      {/* 미니 캘린더 */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{day}</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              index === today.getDay() - 1 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* 오늘 일정 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">오늘 일정</h4>
        {scheduleItems.map((item, index) => (
          <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full mr-3 ${
              item.type === 'meeting' ? 'bg-blue-400' : 'bg-green-400'
            }`}></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{item.title}</div>
              <div className="text-xs text-gray-500">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklySchedule
