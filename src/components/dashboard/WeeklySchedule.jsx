import { useQuery } from '@tanstack/react-query';
import { fetchProjectDashboard } from '../../api/dashboardAPI';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
/** 작성자: 김대호, 배지원 */
function WeeklySchedule({ selectedProjectId }) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const navigate = useNavigate();
  const weekendIssues = dashboardData?.data?.weekendIssues?.weekendIssue || {};
  
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  
  // 현재 날짜 가져오기
  const today = new Date();
  const currentDay = today.getDay() === 0 ? 7 : today.getDay(); // 일요일을 7로 변환
  
  // 이번 주의 시작일(월요일) 계산
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6일 빼기
  startOfWeek.setDate(today.getDate() - daysToMonday);
  
  // 이번 주의 날짜들 생성 (1일부터 7일까지)
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date.getDate());
  }

  // 선택된 날짜 상태 관리
  const [selectedDay, setSelectedDay] = useState(currentDay);

  // 상태별 색상 매핑
  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-gray-400';
      case 'IN_PROGRESS': return 'bg-blue-400';
      case 'REVIEW': return 'bg-orange-400';
      case 'DONE': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'TODO': return '할 일';
      case 'IN_PROGRESS': return '진행중';
      case 'REVIEW': return '검토';
      case 'DONE': return '완료';
      default: return status;
    }
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (dayNumber) => {
    setSelectedDay(dayNumber);
  };

  // 이슈 클릭 핸들러
  const handleIssueClick = (issueId) => {
    navigate(`/api/issues/${issueId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 주 일정</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !selectedProjectId) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 주 일정</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {!selectedProjectId ? '프로젝트를 선택해주세요' : '데이터를 불러올 수 없습니다'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 주 일정</h3>
      
      {/* 미니 캘린더 */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day, index) => {
          const dayNumber = index + 1;
          const dayIssues = weekendIssues[dayNumber] || [];
          const isToday = dayNumber === currentDay;
          const isSelected = dayNumber === selectedDay;
          const dateNumber = weekDates[index];
          
          return (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{day}</div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm relative cursor-pointer transition-colors ${
                  isToday 
                    ? 'bg-blue-500 text-white' 
                    : isSelected
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleDateClick(dayNumber)}
              >
                {dateNumber}
                {dayIssues.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {dayIssues.length}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 선택된 날짜의 일정 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">
          {selectedDay === currentDay ? '오늘 일정' : `${weekDays[selectedDay - 1]}요일 일정`} ({weekDays[selectedDay - 1]})
        </h4>
        
        {weekendIssues[selectedDay] && weekendIssues[selectedDay].length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {weekendIssues[selectedDay].map((issue) => (
              <div 
                key={issue.id} 
                className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleIssueClick(issue.id)}
              >
                <div className={`w-2 h-2 rounded-full mr-3 ${getStatusColor(issue.status)}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{issue.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{new Date(issue.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs px-1 py-0.5 rounded text-white" style={{ backgroundColor: getStatusColor(issue.status).replace('bg-', '#') }}>
                      {getStatusText(issue.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            {selectedDay === currentDay ? '오늘 예정된 이슈가 없습니다' : '해당 날짜에 예정된 이슈가 없습니다'}
          </div>
        )}

        {/* 주간 요약 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700 font-medium mb-1">이번 주 요약</div>
          <div className="text-xs text-blue-600">
            총 {Object.values(weekendIssues).flat().length}개 이슈 예정
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklySchedule;