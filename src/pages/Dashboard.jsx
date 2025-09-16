import React, { useEffect, Suspense } from "react";
import { Source, Warning } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardProjects, fetchProjectDashboard } from "../api/dashboardAPI";
import useProjectStore from "../store/projectStore";
import { 
  KPICardSkeleton, 
  ChartSkeleton, 
  WeeklyScheduleSkeleton, 
  TableSkeleton, 
  ProjectListSkeleton 
} from "../components/common/loading/LoadingComponents";

// Lazy load dashboard components
const KPICard = React.lazy(() => import("../components/dashboard/KPICard"));
const ProjectProgressChart = React.lazy(() => import("../components/dashboard/ProjectProgressChart"));
const WeeklySchedule = React.lazy(() => import("../components/dashboard/WeeklySchedule"));
const PriorityTasks = React.lazy(() => import("../components/dashboard/PriorityTasks"));
const TeamProductivityTrend = React.lazy(() => import("../components/dashboard/TeamProductivityTrend"));
const ErrorList = React.lazy(() => import("../components/dashboard/ErrorList"));
const ProjectList = React.lazy(() => import("../components/dashboard/ProjectList"));

function Dashboard() {
  const navigate = useNavigate();
  const { selectedProjectId } = useProjectStore();

  // fetchDashboardProjects API에서 전체 데이터 가져오기
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboardProjects'],
    queryFn: fetchDashboardProjects,
  });

  // fetchProjectDashboard API에서 프로젝트별 데이터 가져오기
  const { data: projectDashboardData } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  // 서버 데이터에서 KPI 값 추출
  const projectCount = dashboardData?.data?.projectCount || 0;
  const issueCount = dashboardData?.data?.issueCount || 0;

  // 사용자 역할 확인 - 대소문자 구분 없이 체크
  const userRole = projectDashboardData?.data?.role || 'User';
  const isPM = userRole?.toUpperCase() === 'PM';
  const isMaster = userRole?.toUpperCase() === 'MASTER';
  const isUser = userRole?.toUpperCase() === 'USER';
  const isAdmin = isPM || isMaster; // PM 또는 MASTER 권한

  // 디버깅용 로그
  useEffect(() => {
    if (projectDashboardData) {
      console.log('프로젝트 대시보드 데이터:', projectDashboardData);
      console.log('사용자 역할:', userRole);
      console.log('PM 여부:', isPM);
      console.log('MASTER 여부:', isMaster);
      console.log('Admin 권한 여부:', isAdmin);
      console.log('User 여부:', isUser);
    }
  }, [projectDashboardData, userRole, isPM, isMaster, isAdmin, isUser]);

  const kpiData = [
    {
      title: "진행 중인 프로젝트",
      value: projectCount.toString(),
      icon: <Source className="w-6 h-6 text-blue-500" />,
      trend: "up",
      trendValue: "+12%",
      path: "/projects"
    },
    {
      title: "진행 중인 이슈",
      value: issueCount.toString(),
      icon: <Warning className="w-6 h-6 text-orange-500" />,
      trend: "down",
      trendValue: "-5%",
      path: "/issues"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-3">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Suspense fallback={<ChartSkeleton height="h-64" title />}>
                <ProjectProgressChart selectedProjectId={selectedProjectId} />
              </Suspense>
              
              {/* 에러 발생 창 - PM 또는 MASTER일 경우에만 표시 */}
              {isAdmin && (
                <Suspense fallback={<TableSkeleton rows={3} title />}>
                  <ErrorList selectedProjectId={selectedProjectId} />
                </Suspense>
              )}
              
              <Suspense fallback={<WeeklyScheduleSkeleton />}>
                <WeeklySchedule selectedProjectId={selectedProjectId} />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Suspense fallback={<KPICardSkeleton count={2} />}>
                {kpiData.map((kpi, index) => (
                  <KPICard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon}
                    trend={kpi.trend}
                    trendValue={kpi.trendValue}
                    onClick={() => kpi.path && navigate(kpi.path)}
                  />
                ))}
              </Suspense>
            </div>
            
            {/* 인원별 이슈 진행률 - 역할에 따라 제목 변경 */}
            <Suspense fallback={<ChartSkeleton height="h-64" title />}>
              <TeamProductivityTrend 
                selectedProjectId={selectedProjectId}
                title={isUser ? "이슈 진행률" : "인원별 이슈 진행률"}
              />
            </Suspense>
            
            <Suspense fallback={<TableSkeleton rows={5} title />}>
              <PriorityTasks selectedProjectId={selectedProjectId} />
            </Suspense>
            
          </div>
        </div>

        {/* 오른쪽 1/4 영역 - 내 참여 프로젝트 */}
        <div className="col-span-2">
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;