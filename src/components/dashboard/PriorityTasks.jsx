function PriorityTasks() {
    // 예시 데이터
  const tasks = {
    high: [
      { id: 1, title: '로그인 API 연동', assignee: '김개발' },
      { id: 2, title: '보안 취약점 수정', assignee: '박보안' }
    ],
    medium: [
      { id: 3, title: '대시보드 차트 구현', assignee: '이프론트' },
      { id: 4, title: '사용자 권한 관리', assignee: '최백엔드' }
    ],
    low: [
      { id: 5, title: 'UI 다크모드 추가', assignee: '김디자인' },
      { id: 6, title: '문서화 작업', assignee: '박문서' }
    ]
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return '🔴 높음';
      case 'medium': return '🟡 보통';
      case 'low': return '🟢 낮음';
      default: return '⚪ 기타';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">우선순위 작업</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          칸반보드로 이동
        </button>
      </div>
      
      <div className="space-y-4">
        {Object.entries(tasks).map(([priority, taskList]) => (
          <div key={priority}>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {getPriorityLabel(priority)}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                ({taskList.length}개)
              </span>
            </div>
            <div className="space-y-2">
              {taskList.map((task) => (
                <div 
                  key={task.id}
                  className={`p-3 rounded-lg border-l-4 ${getPriorityColor(priority)} hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {task.title}
                    </span>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {task.assignee.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PriorityTasks
