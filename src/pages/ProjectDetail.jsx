import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowBack, 
  Star, 
  StarBorder, 
  Edit, 
  Share,
  MoreVert,
  Assignment,
  Timeline,
  PeopleAlt,
  Settings,
  BugReport,
  Analytics
} from '@mui/icons-material'
import Kanban from '../components/kanban/Kanban'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('kanban')
  
  // 샘플 프로젝트 데이터
  const project = {
    id: 1,
    name: 'ERP 시스템 개편',
    description: '기존 ERP 시스템의 UI/UX 개선 및 기능 확장',
    status: 'progress',
    priority: 'high',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    manager: 'Kim Manager',
    team: ['김개발', '박디자인', '이기획'],
    completedTasks: 13,
    totalTasks: 20,
    isStarred: true
  }

  const tabs = [
    { id: 'kanban', label: '칸반 보드', icon: Assignment },
    { id: 'timeline', label: '간트차트', icon: Timeline },
    { id: 'team', label: '팀 관리', icon: PeopleAlt },
    { id: 'reports', label: '리포트', icon: Analytics },
    { id: 'issues', label: '이슈 관리', icon: BugReport },
    { id: 'settings', label: '설정', icon: Settings }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'hold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'planning': return '계획중'
      case 'progress': return '진행중'
      case 'review': return '검토중'
      case 'completed': return '완료'
      case 'hold': return '보류'
      default: return '알 수 없음'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'kanban':
        return <Kanban projectId={id} />
      case 'timeline':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">간트차트</h3>
            <p className="text-gray-600">간트차트</p>
          </div>
        )
      case 'team':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">팀 관리</h3>
            <div className="space-y-4">
              {project.team.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md border border-white/20">
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-medium">
                    {member[0]}
                  </div>
                  <div>
                    <div className="font-medium">{member}</div>
                    <div className="text-sm text-gray-600">팀 멤버</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'reports':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">프로젝트 리포트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4">
                <h4 className="font-medium mb-2">진행률</h4>
                <div className="text-2xl font-bold text-blue-600">{project.progress}%</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4">
                <h4 className="font-medium mb-2">완료된 작업</h4>
                <div className="text-2xl font-bold text-green-600">{project.completedTasks}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4">
                <h4 className="font-medium mb-2">총 작업</h4>
                <div className="text-2xl font-bold text-gray-600">{project.totalTasks}</div>
              </div>
            </div>
          </div>
        )
      case 'issues':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">이슈 관리</h3>
            <p className="text-gray-600">이슈 관리</p>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">프로젝트 설정</h3>
            <p className="text-gray-600">프로젝트 설정.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 프로젝트 헤더 */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-white/50 transition-colors"
            >
              <ArrowBack className="w-5 h-5" />
            </button>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <button className="p-1 hover:bg-gray-100 transition-colors">
                  {project.isStarred ? (
                    <Star className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <StarBorder className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority === 'high' ? '높음' : project.priority === 'medium' ? '보통' : '낮음'}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 transition-colors">
              <MoreVert className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
          <div>매니저: <span className="font-medium">{project.manager}</span></div>
          <div>시작일: <span className="font-medium">{project.startDate}</span></div>
          <div>완료 예정일: <span className="font-medium">{project.endDate}</span></div>
          <div>팀원: <span className="font-medium">{project.team.length}명</span></div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'border-white rounded-lg bg-green-300 text-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ProjectDetail
