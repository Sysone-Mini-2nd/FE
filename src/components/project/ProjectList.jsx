import React from 'react'
import ProjectCard from './ProjectCard'
import ProjectTable from './ProjectTable'

function ProjectList({ 
  projects, 
  viewType, 
  searchTerm, 
  filters, 
  sortBy, 
  onProjectSelect, 
  onProjectUpdate 
}) {
  // 필터링 로직
  const filteredProjects = projects.filter(project => {
    // 검색어 필터
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // 상태 필터
    if (filters.status !== 'all' && project.status !== filters.status) {
      return false
    }

    // 우선순위 필터
    if (filters.priority !== 'all' && project.priority !== filters.priority) {
      return false
    }

    // 담당자 필터
    if (filters.assignee !== 'all' && project.manager !== filters.assignee) {
      return false
    }

    // 기간 필터
    if (filters.period !== 'all') {
      const endDate = new Date(project.endDate)
      const today = new Date()
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)

      switch (filters.period) {
        case 'thisWeek':
          if (endDate < startOfWeek) return false
          break
        case 'thisMonth':
          if (endDate < startOfMonth) return false
          break
        case 'thisQuarter':
          if (endDate < startOfQuarter) return false
          break
        case 'overdue':
          if (project.status !== 'progress' || endDate >= new Date()) return false
          break
        default:
          break
      }
    }

    return true
  })

  // 정렬 로직
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'progress':
        return b.progress - a.progress
      case 'endDate':
        return new Date(a.endDate) - new Date(b.endDate)
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      case 'created':
      default:
        return b.id - a.id
    }
  })

  const handleProjectAction = (action, project) => {
    switch (action) {
      case 'view':
      case 'edit':
        onProjectSelect(project)
        break
      case 'delete':
        if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
          onProjectUpdate(prev => prev.filter(p => p.id !== project.id))
        }
        break
      case 'clone': {
        const clonedProject = {
          ...project,
          id: Date.now(),
          name: `${project.name} (복사본)`,
          status: 'planning',
          progress: 0,
          completedTasks: 0
        }
        onProjectUpdate(prev => [...prev, clonedProject])
        break
      }
      case 'star':
        onProjectUpdate(prev => prev.map(p => 
          p.id === project.id ? { ...p, isStarred: !p.isStarred } : p
        ))
        break
      default:
        break
    }
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
        <p className="text-gray-500">
          {searchTerm || Object.values(filters).some(f => f !== 'all') 
            ? '검색 조건에 맞는 프로젝트를 찾을 수 없습니다.' 
            : '새 프로젝트를 생성하여 시작해보세요.'
          }
        </p>
      </div>
    )
  }

  // 뷰 타입에 따른 렌더링
  switch (viewType) {
    case 'card':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onAction={handleProjectAction}
            />
          ))}
        </div>
      )
    
    case 'table':
      return (
        <ProjectTable
          projects={sortedProjects}
          onAction={handleProjectAction}
        />
      )
    
    default:
      return null
  }
}

export default ProjectList
