import { useQuery } from '@tanstack/react-query';
import { fetchProjectDashboard } from '../../api/dashboardAPI';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
/** 작성자: 김대호, 배지원 */
function PriorityTasks({ selectedProjectId }) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const navigate = useNavigate();
  const priorities = dashboardData?.data?.priorities?.priority || [];

  // 각 우선순위별로 표시할 항목 수를 관리하는 상태
  const [visibleItems, setVisibleItems] = useState({});

  // 우선순위별 색상 매핑
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'LOW':
        return {
          dotColor: 'bg-green-500',
          label: '낮음',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'NORMAL':
        return {
          dotColor: 'bg-yellow-500',
          label: '보통',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'HIGH':
        return {
          dotColor: 'bg-red-500',
          label: '높음',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'WARNING':
        return {
          dotColor: 'bg-red-600',
          label: '긴급',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300'
        };
      default:
        return {
          dotColor: 'bg-gray-500',
          label: priority,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  // 우선순위 정렬 함수
  const getPriorityOrder = (priority) => {
    switch (priority) {
      case 'HIGH': return 1;
      case 'NORMAL': return 2;
      case 'LOW': return 3;
      case 'WARNING': return 0; // WARNING은 가장 높은 우선순위
      default: return 4;
    }
  };

  // 이슈 클릭 핸들러
  const handleIssueClick = (issueId) => {
    navigate(`/api/issues/${issueId}`);
  };

  // 더 보기 클릭 핸들러
  const handleShowMore = (priority) => {
    setVisibleItems(prev => ({
      ...prev,
      [priority]: (prev[priority] || 3) + 3
    }));
  };

  // 더 적게 보기 클릭 핸들러
  const handleShowLess = (priority) => {
    setVisibleItems(prev => ({
      ...prev,
      [priority]: 3
    }));
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">우선순위 작업</h3>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !selectedProjectId) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">우선순위 작업</h3>
        </div>
        <div className="flex items-center justify-center h-48 text-gray-500">
          {!selectedProjectId ? '프로젝트를 선택해주세요' : '데이터를 불러올 수 없습니다'}
        </div>
      </div>
    );
  }

  // WARNING 우선순위는 제외 (에러 리스트 컴포넌트에서 표시)
  const filteredPriorities = priorities
    .filter(p => p.priority !== 'WARNING')
    .sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">우선순위 작업</h3>
      </div>
      
      <div className="space-y-3">
        {filteredPriorities.map((priorityGroup) => {
          const config = getPriorityConfig(priorityGroup.priority);
          const currentVisibleItems = visibleItems[priorityGroup.priority] || 3;
          const totalItems = priorityGroup.priorityDataList.length;
          const hasMoreItems = totalItems > currentVisibleItems;
          const hasLessItems = currentVisibleItems > 3;

          return (
            <div key={priorityGroup.priority} className="space-y-2">
              {/* 우선순위 헤더 - 기존처럼 배경색 없이 */}
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.dotColor}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {config.label}
                </span>
                <span className="text-sm text-gray-500">
                  ({totalItems}개)
                </span>
              </div>

              {/* 작업 목록 - 우선순위별 배경색 적용 */}
              <div className="space-y-2 ml-6">
                {priorityGroup.priorityDataList.slice(0, currentVisibleItems).map((task) => (
                <div
                    key={task.id}
                    className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor} hover:opacity-80 transition-opacity cursor-pointer`}
                    onClick={() => handleIssueClick(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 truncate mb-1">
                          {task.title}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{task.writerName}</span>
                          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                            {task.writerName?.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                
                {/* 더 보기/더 적게 보기 버튼 */}
                {hasMoreItems && (
                  <div 
                    className="text-xs text-blue-500 text-center py-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleShowMore(priorityGroup.priority)}
                  >
                    +{totalItems - currentVisibleItems}개 더 보기
                  </div>
                )}

                
                {hasLessItems && (
                  <div 
                    className="text-xs text-gray-500 text-center py-1 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => handleShowLess(priorityGroup.priority)}
                  >
                    접기
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredPriorities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <p className="text-sm">우선순위 작업이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PriorityTasks;