import React from 'react'

function TeamProductivityTrend() {
    //예시 데이터
  const weeklyData = [
    { week: '1주차', completed: 85, planned: 90 },
    { week: '2주차', completed: 92, planned: 95 },
    { week: '3주차', completed: 78, planned: 85 },
    { week: '4주차', completed: 88, planned: 90 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">팀 생산성 트렌드</h3>
      
      {/* 임시 차트 - 나중에 실제 차트 라이브러리로 교체 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">완료율</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-gray-600">계획 대비</span>
          </div>
        </div>

        <div className="space-y-3">
          {weeklyData.map((data, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{data.week}</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.completed}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="relative h-2 rounded-full">
                  {/* 계획 대비 진행률 (회색 배경) */}
                  <div 
                    className="absolute top-0 left-0 h-2 bg-gray-300 rounded-full"
                    style={{ width: `${data.planned}%` }}
                  ></div>
                  {/* 실제 완료율 (파란색) */}
                  <div 
                    className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${data.completed}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 요약 정보 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">평균 완료율</span>
            <span className="text-lg font-bold text-blue-900">85.8%</span>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            지난 주 대비 +3.2% 상승
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamProductivityTrend
