function RecentNotifications() {

    //예시 데이터
  const notifications = [
    {
      id: 1,
      type: 'mention',
      title: '김팀장님이 회의록에서 언급했습니다',
      message: '"UI 개선 건은 이번 주까지 완료해주세요"',
      time: '5분 전',
      isRead: false
    },
    {
      id: 2,
      type: 'approval',
      title: '프로젝트 예산 승인 요청',
      message: '개발팀 추가 장비 구매 건이 승인 대기 중입니다',
      time: '1시간 전',
      isRead: false
    },
    {
      id: 3,
      type: 'update',
      title: '프로젝트 상태 업데이트',
      message: '모바일 앱 개발이 80% 완료되었습니다',
      time: '3시간 전',
      isRead: true
    },
    {
      id: 4,
      type: 'system',
      title: '시스템 점검 안내',
      message: '오늘 밤 12시-2시 서버 점검이 예정되어 있습니다',
      time: '5시간 전',
      isRead: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'mention': return '💬';
      case 'approval': return '✅';
      case 'update': return '📈';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'mention': return 'bg-blue-100 text-blue-800';
      case 'approval': return 'bg-yellow-100 text-yellow-800';
      case 'update': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">최근 알림 & 활동</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notifications.filter(n => !n.isRead).length}
          </span>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            모두 읽음
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
              notification.isRead 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                    {notification.type.toUpperCase()}
                  </span>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <button className="w-full text-sm text-center text-blue-600 hover:text-blue-800">
          모든 알림 보기
        </button>
      </div>
    </div>
  )
}

export default RecentNotifications
