import { useQuery } from '@tanstack/react-query';
import { fetchProjectDashboard } from '../../api/dashboardAPI';
import { Warning, Person, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ErrorList({ selectedProjectId }) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const navigate = useNavigate();
  const priorities = dashboardData?.data?.priorities?.priority || [];
  const errorPriorities = dashboardData?.data?.errorPriorities || {};
    
  // WARNING 우선순위만 필터링 (에러로 간주)
  const errorTasks = priorities.find(p => p.priority === 'WARNING')?.priorityDataList || [];

  // 이슈 클릭 핸들러
  const handleIssueClick = (issueId) => {
    navigate(`/api/issues/${issueId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">에러 발생</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !selectedProjectId) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">에러 발생</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {!selectedProjectId ? '프로젝트를 선택해주세요' : '데이터를 불러올 수 없습니다'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Warning className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">에러 발생</h3>
        {errorTasks.length > 0 && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {errorTasks.length}
          </span>
        )}
      </div>
      
      {errorTasks.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {errorTasks.map((task) => (
            <div key={task.id} className="p-4 bg-red-50 border border-red-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Warning className="w-5 h-5 text-red-500 mt-0.5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-red-900 truncate">
                      {task.title}
                    </h4>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-medium">
                      긴급
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-red-700">
                    <div className="flex items-center gap-1">
                      <Person className="w-3 h-3" />
                      <span>{task.writerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AccessTime className="w-3 h-3" />
                      <span>{errorPriorities.endDate || '즉시 처리 필요'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 액션 버튼 */}
              <div className="mt-3 flex gap-2">
                <button 
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors cursor-pointer"
                  onClick={() => handleIssueClick(task.id)}
                >
                  상세보기
                </button>
                <button className="text-xs border border-red-300 text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors">
                  담당자 연락
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">에러가 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">모든 작업이 정상적으로 진행되고 있습니다</p>
        </div>
      )}

      {/* 요약 정보 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            총 에러 작업
          </span>
          <span className={`font-medium ${errorTasks.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {errorTasks.length}개
          </span>
        </div>
      </div>
    </div>
  );
}

export default ErrorList;