import { useQuery } from '@tanstack/react-query';
import { fetchProjectDashboard } from '../../api/dashboardAPI';

function PriorityTasks({ selectedProjectId }) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const priorities = dashboardData?.data?.priorities?.priority || [];

  // 우선순위별 색상 매핑
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'LOW':
        return { 
          dotColor: 'bg-green-500',
          label: '낮음',
          bgColor: 'bg-gray-50'
        };
      case 'NORMAL':
        return { 
          dotColor: 'bg-yellow-500',
          label: '보통',
          bgColor: 'bg-gray-50'
        };
      case 'HIGH':
        return { 
          dotColor: 'bg-red-500',
          label: '높음',
          bgColor: 'bg-gray-50'
        };
      case 'WARNING':
        return { 
          dotColor: 'bg-red-600',
          label: '긴급',
          bgColor: 'bg-gray-50'
        };
      default:
        return { 
          dotColor: 'bg-gray-500',
          label: priority,
          bgColor: 'bg-gray-50'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">우선순위 작업</h3>
          <button className="text-sm text-blue-500 hover:text-blue-600">
            칸반보드로 이동
          </button>
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
          <button className="text-sm text-blue-500 hover:text-blue-600">
            칸반보드로 이동
          </button>
        </div>
        <div className="flex items-center justify-center h-48 text-gray-500">
          {!selectedProjectId ? '프로젝트를 선택해주세요' : '데이터를 불러올 수 없습니다'}
        </div>
      </div>
    );
  }

  // WARNING 우선순위는 제외 (에러 리스트 컴포넌트에서 표시)
  const filteredPriorities = priorities.filter(p => p.priority !== 'WARNING');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">우선순위 작업</h3>
        <button className="text-sm text-blue-500 hover:text-blue-600">
          칸반보드로 이동
        </button>
      </div>
      
      <div className="space-y-3">
        {filteredPriorities.map((priorityGroup) => {
          const config = getPriorityConfig(priorityGroup.priority);
          
          return (
            <div key={priorityGroup.priority} className="space-y-2">
              {/* 우선순위 헤더 */}
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.dotColor}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {config.label}
                </span>
                <span className="text-sm text-gray-500">
                  ({priorityGroup.priorityDataList.length}개)
                </span>
              </div>

              {/* 작업 목록 */}
              <div className="space-y-2 ml-6">
                {priorityGroup.priorityDataList.slice(0, 3).map((task) => (
                  <div key={task.id} className={`p-3 rounded-lg ${config.bgColor} hover:bg-gray-100 transition-colors cursor-pointer`}>
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
                
                {/* 더 많은 항목이 있을 경우 */}
                {priorityGroup.priorityDataList.length > 3 && (
                  <div className="text-xs text-gray-400 text-center py-1">
                    +{priorityGroup.priorityDataList.length - 3}개 더
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
