function GitHubActivity() {

    //예시 데이터
  const activities = [
    {
      id: 1,
      type: 'commit',
      message: 'feat: 대시보드 컴포넌트 추가',
      author: '김개발',
      time: '2시간 전',
      repo: 'sysone-frontend'
    },
    {
      id: 2,
      type: 'pr',
      message: 'fix: 사이드바 네비게이션 버그 수정',
      author: '박코딩',
      time: '4시간 전',
      repo: 'sysone-frontend'
    },
    {
      id: 3,
      type: 'issue',
      message: '로그인 페이지 UI 개선 요청',
      author: '이디자인',
      time: '6시간 전',
      repo: 'sysone-frontend'
    },
    {
      id: 4,
      type: 'commit',
      message: 'refactor: API 호출 로직 개선',
      author: '최백엔드',
      time: '8시간 전',
      repo: 'sysone-backend'
    }
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'commit': return '💾';
      case 'pr': return '🔀';
      case 'issue': return '🐛';
      default: return '📝';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'commit': return 'bg-green-100 text-green-800';
      case 'pr': return 'bg-blue-100 text-blue-800';
      case 'issue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">최근 GitHub 활동</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          전체 보기
        </button>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              <span className="text-lg">{getTypeIcon(activity.type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                  {activity.type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{activity.repo}</span>
              </div>
              <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
              <div className="flex items-center text-xs text-gray-500">
                <span>{activity.author}</span>
                <span className="mx-1">•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GitHubActivity
