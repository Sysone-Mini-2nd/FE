import { 
  MoreVert, 
  Group, 
  Schedule,
  PlayArrow,
  CheckCircle,
  Pause,
  HourglassEmpty
} from '@mui/icons-material'

function ProjectListItem({ project, onAction }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'progress':
        return { label: '진행중', color: 'bg-green-500/20 text-green-700 border-green-200/50 backdrop-blur-sm' }
      case 'completed':
        return { label: '완료', color: 'bg-blue-500/20 text-blue-700 border-blue-200/50 backdrop-blur-sm' }
      case 'paused':
        return { label: '일시정지', color: 'bg-yellow-500/20 text-yellow-700 border-yellow-200/50 backdrop-blur-sm' }
      case 'planning':
        return { label: '계획중', color: 'bg-gray-500/20 text-gray-700 border-gray-200/50 backdrop-blur-sm' }
      default:
        return { label: status, color: 'bg-gray-500/20 text-gray-700 border-gray-200/50 backdrop-blur-sm' }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/15 backdrop-blur-sm border border-red-200/30'
      case 'medium':
        return 'bg-yellow-500/15 backdrop-blur-sm border border-yellow-200/30'
      case 'low':
        return 'bg-green-500/15 backdrop-blur-sm border border-green-200/30'
      default:
        return 'bg-gray-500/15 backdrop-blur-sm border border-gray-200/30'
    }
  }

  const statusInfo = getStatusInfo(project.status)
  const progressColor = project.progress >= 80 ? 'bg-green-600' : 
                       project.progress >= 50 ? 'bg-blue-600' : 'bg-gray-400'

  const isOverdue = new Date(project.endDate) < new Date() && project.status === 'progress'
  const daysRemaining = Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className={`bg-white/80 backdrop-blur-md p-4 ${getPriorityColor(project.priority)} hover:bg-white/90 hover:border-white/40 transition-all duration-300 group shadow-lg shadow-black/5`}>
      <div className="flex items-center gap-4">
        {/* 프로젝트 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate"
              onClick={() => onAction('view', project)}
            >
              {project.name}
            </h3>
            {/* <button
              onClick={() => onAction('star', project)}
              className="text-gray-400 hover:text-yellow-600 transition-colors flex-shrink-0"
            >
              {project.isStarred ? 
                <Star className="w-4 h-4 text-yellow-600" /> : 
                <StarBorder className="w-4 h-4" />
              }
            </button> */}
            <div className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${statusInfo.color}`}>
              {statusInfo.label}
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">
            {project.description}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>PM: {project.manager}</span>
            <div className="flex items-center gap-1">
              <Group className="w-4 h-4" />
              <span>{project.team.length}명</span>
            </div>
            <div className="flex items-center gap-1">
              <Schedule className="w-4 h-4" />
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
            {isOverdue && (
              <span className="text-red-600 font-medium">
                {Math.abs(daysRemaining)}일 지연
              </span>
            )}
          </div>
        </div>

        {/* 진행률 */}
        <div className="flex-shrink-0 w-32">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">진행률</span>
            <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200/50 backdrop-blur-sm h-2 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{project.completedTasks}</span>
            <span>{project.totalTasks}</span>
          </div>
        </div>

        {/* 팀원 아바타 */}
        <div className="flex-shrink-0">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white/80 backdrop-blur-sm"
                title={member}
              >
                {member.slice(0, 1)}
              </div>
            ))}
            {project.team.length > 3 && (
              <div className="w-8 h-8 bg-gray-200/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white/80">
                +{project.team.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* 액션 메뉴 */}
        <div className="relative group/menu flex-shrink-0">
          <button className="p-2 hover:bg-white/50 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-all">
            <MoreVert className="w-4 h-4 text-gray-500" />
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-white/90 backdrop-blur-md border border-white/20 shadow-lg py-1 opacity-0 group-hover/menu:opacity-100 invisible group-hover/menu:visible transition-all z-10">
            <button
              onClick={() => onAction('view', project)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-white/50"
            >
              보기
            </button>
            <button
              onClick={() => onAction('edit', project)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-white/50"
            >
              편집
            </button>
            <button
              onClick={() => onAction('clone', project)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-white/50"
            >
              복제
            </button>
            <div className="border-t border-white/20 my-1"></div>
            <button
              onClick={() => onAction('delete', project)}
              className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50/50"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListItem
