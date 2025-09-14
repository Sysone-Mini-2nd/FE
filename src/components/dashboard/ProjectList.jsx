import { Suspense, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { 
  Group, 
  Assignment,
  AccessTime,
} from '@mui/icons-material';
import { fetchDashboardProjects } from '../../api/dashboardAPI';
import { ProjectListSkeleton, ErrorFallback } from '../common/loading/LoadingComponents';
import useProjectStore from '../../store/projectStore';

// 데이터 로딩 컴포넌트 (TanStack Query 사용)
function ProjectListContent() {
  const navigate = useNavigate();
  const { selectedProjectId, setSelectedProjectId } = useProjectStore();
  
  const { data: response} = useQuery({
    queryKey: ['projectList'],
    queryFn: fetchDashboardProjects,
    suspense: true, // Suspense 모드 활성화
  });

  // API 응답에서 프로젝트 데이터 추출
  const projects = useMemo(() => response?.data?.projects || [], [response?.data?.projects]);

  // 첫 번째 프로젝트를 기본 선택으로 설정
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProjectId]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981'; // green-500
    if (progress >= 50) return '#3b82f6'; // blue-500
    if (progress >= 30) return '#f59e0b'; // amber-500
    return '#9ca3af'; // gray-400
  };

  const getStatusInfo = (daysRemaining, overdue) => {
    if (overdue) return { text: '지연', color: 'text-red-600', bg: 'bg-red-50' };
    if (daysRemaining <= 3) return { text: '긴급', color: 'text-red-600', bg: 'bg-red-50' };
    if (daysRemaining <= 7) return { text: '임박', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: '정상', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const isOverdue = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
    // 선택한 프로젝트로 대시보드 데이터 업데이트
  };

  const handleProjectDetailClick = (projectId, e) => {
    e.stopPropagation(); // 프로젝트 선택 이벤트 방지
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">내 프로젝트</h3>
          <span className="text-sm text-gray-500">{projects.length}개</span>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="divide-y divide-gray-100 border border-gray-200 max-h-full overflow-y-auto">
        {projects.map((project) => {
          const daysRemaining = getDaysRemaining(project.endDate);
          const overdue = isOverdue(project.endDate);
          const status = getStatusInfo(daysRemaining, overdue);
          const isSelected = selectedProjectId === project.id;
          
          return (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className={`p-4 cursor-pointer transition-colors group ${
                isSelected 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* 프로젝트 헤더 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium transition-colors truncate">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Group/>
                      {project.participant.length}명
                    </span>
                    <span className="flex items-center gap-1">
                      <Assignment/>
                      {project.totalTasks}개 작업
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${status.bg} ${status.color}`}>
                    {status.text}
                  </span>
                </div>
              </div>

              {/* 진행률 */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">진행률</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(project.progressRate)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${project.progressRate}%`,
                      backgroundColor: getProgressColor(project.progressRate)
                    }}
                  />
                </div>
              </div>

              {/* 마감일 및 팀원 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <AccessTime className="w-4 h-4" />
                  <span>
                    {overdue ? '마감 지남' : `${daysRemaining}일 남음`}
                  </span>
                  <span className="text-gray-400">/</span>
                  <span>{new Date(project.endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  {project.participant.slice(0, 3).map((member, index) => (
                    <span 
                      key={index}
                      className="w-6 h-6 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                      title={member}
                    >
                      {member.charAt(0)}
                    </span>
                  ))}
                  {project.participant.length > 3 && (
                    <span className="w-6 h-6 bg-gray-300 text-gray-600 text-xs rounded-full flex items-center justify-center font-medium">
                      +{project.participant.length - 3}
                    </span>
                  )}
                  <button
                    onClick={(e) => handleProjectDetailClick(project.id, e)}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 빈 상태 */}
      {projects.length === 0 && (
        <div className="p-8 text-center">
          <Assignment className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">참여중인 프로젝트가 없습니다</p>
        </div>
      )}
    </div>
  );
}

function ProjectList() {
  const queryClient = useQueryClient();
  
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback 
          error={error} 
          onRetry={resetErrorBoundary}
        />
      )}
      onReset={() => {
        // 특정 쿼리만 무효화하여 재시도 (전체 새로고침 X)
        queryClient.invalidateQueries({ queryKey: ['projectList'] });
      }}
    >
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectListContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default ProjectList;