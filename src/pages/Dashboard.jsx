import KPICard from '../components/dashboard/KPICard'
import ProjectProgressChart from '../components/dashboard/ProjectProgressChart'
import WeeklySchedule from '../components/dashboard/WeeklySchedule'
import GitHubActivity from '../components/dashboard/GitHubActivity'
import PriorityTasks from '../components/dashboard/PriorityTasks'
import TeamProductivityTrend from '../components/dashboard/TeamProductivityTrend'
import RecentNotifications from '../components/dashboard/RecentNotifications'
import { GitHub, People, Source, Warning } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate();
  const kpiData = [
    {
      title: "진행 중인 프로젝트",
      value: "12",
      icon: <Source />,
      trend: "up",
      path: "/projects",
      trendValue: "+2 from last month"
    },
    {
      title: "이번 주 마감 작업",
      value: "8",
      icon: <Warning />,
      trend: "down",
      trendValue: "-3 from last week"
    },
    {
      title: "금주 GitHub 커밋",
      value: "47",
      icon: <GitHub />,
      trend: "up",
      trendValue: "+12 from last week"
    },
    {
      title: "활성 팀원",
      value: "15",
      icon: <People/>,
      trend: "up",
      trendValue: "+1 new member"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 메인 위젯들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 컬럼 */}
        <div className="space-y-6">
          <ProjectProgressChart />
          <WeeklySchedule />
          <TeamProductivityTrend />
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="space-y-6">
          <GitHubActivity />
          <PriorityTasks />
          <RecentNotifications />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
