function ProjectProgressChart() {

    //예시 데이터
  const progressData = [
    { label: '완료', value: 45, color: '#10B981' },
    { label: '진행중', value: 35, color: '#3B82F6' },
    { label: '계획', value: 20, color: '#6B7280' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 진행률</h3>
      
      {/* 임시 도넛 차트 - 나중에 실제 차트 라이브러리로 교체 */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-gray-700">80%</span>
          </div>
        </div>
        
        <div className="w-full space-y-2">
          {progressData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectProgressChart
