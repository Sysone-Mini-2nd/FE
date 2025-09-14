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

function Dashboard() {
  const navigate = useNavigate();
  const { selectedProjectId } = useProjectStore();

  const kpiData = [
    {
      title: "진행 중인 프로젝트",
      value: "12",
      icon: <Source />,
      trend: "up",
      path: "/projects",
      trendValue: "+2 from last month",
    },
    {
      title: "이번 주 마감 작업",
      value: "8",
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
            {/* KPI 카드들 */}
            
            <div className="grid grid-cols-1 gap-6">
              <ProjectProgressChart selectedProjectId={selectedProjectId} />
              <ErrorList selectedProjectId={selectedProjectId} />
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
            <TeamProductivityTrend selectedProjectId={selectedProjectId} />
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
