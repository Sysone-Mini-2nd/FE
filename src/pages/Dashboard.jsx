import React, { useEffect } from "react";
import KPICard from "../components/dashboard/KPICard";
import ProjectProgressChart from "../components/dashboard/ProjectProgressChart";
import WeeklySchedule from "../components/dashboard/WeeklySchedule";
import PriorityTasks from "../components/dashboard/PriorityTasks";
import TeamProductivityTrend from "../components/dashboard/TeamProductivityTrend";
import ErrorList from "../components/dashboard/ErrorList";
import ProjectList from "../components/dashboard/ProjectList";
import useProjectStore from "../store/projectStore";
import { Source, Warning } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardProjects, fetchProjectDashboard } from "../api/dashboardAPI";

function Dashboard() {
  const navigate = useNavigate();
  const { selectedProjectId } = useProjectStore();

  // fetchDashboardProjects API에서 데이터 가져오기
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

  // 사용자 역할 확인
  const userRole = projectDashboardData?.data?.role || 'User';
  const isPM = userRole === 'PM';
  const isUser = userRole === 'User';

  // 디버깅용 로그
  useEffect(() => {
    if (projectDashboardData) {
      console.log('프로젝트 대시보드 데이터:', projectDashboardData);
      console.log('사용자 역할:', userRole);
      console.log('PM 여부:', isPM);
      console.log('User 여부:', isUser);
    }
  }, [projectDashboardData, userRole, isPM, isUser]);

  const kpiData = [
    {
      title: "진행 중인 프로젝트",
      value: projectCount.toString(),
      icon: <Source />,
      trend: "up",
      path: "/projects",
      trendValue: "+2 from last month",
    },
    {
      title: "이번 주 마감 작업",
      value: issueCount.toString(),
      icon: <Warning />,
      trend: "down",
      trendValue: "-3 from last week",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-3">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ProjectProgressChart selectedProjectId={selectedProjectId} />
              
              {/* 에러 발생 창 - PM일 경우에만 표시 */}
              {isPM && (
                <ErrorList selectedProjectId={selectedProjectId} />
              )}
              
              <WeeklySchedule selectedProjectId={selectedProjectId} />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
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
            </div>
            
            {/* 인원별 이슈 진행률 - 역할에 따라 제목 변경 */}
            <TeamProductivityTrend 
              selectedProjectId={selectedProjectId}
              title={isUser ? "이슈 진행률" : "인원별 이슈 진행률"}
            />
            
            <PriorityTasks selectedProjectId={selectedProjectId} />
            
          </div>
        </div>

        {/* 오른쪽 1/4 영역 - 내 참여 프로젝트 */}
        <div className="col-span-2">
          <ProjectList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;