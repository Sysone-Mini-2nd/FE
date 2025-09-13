import React, { useState } from 'react'
import ProjectHeader from '../components/project/ProjectHeader'
import ProjectStats from '../components/project/ProjectStats'
import ProjectFilters from '../components/project/ProjectFilters'
import ProjectList from '../components/project/ProjectList'
import ProjectModal from '../components/project/ProjectModal'

function ProjectManager() {
  const [viewType, setViewType] = useState('card') // 'card', 'list', 'table'
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    period: 'all'
  })
  const [sortBy, setSortBy] = useState('created')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  // 샘플 프로젝트 데이터
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'ERP 시스템 개편',
      description: '기존 ERP 시스템의 UI/UX 개선 및 기능 확장',
      status: 'progress',
      priority: 'high',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      manager: 'Kim Manager',
      completedTasks: 13,
      totalTasks: 20,
    },
    {
      id: 2,
      name: '모바일 앱 개발',
      description: '고객용 모바일 애플리케이션 신규 개발',
      status: 'progress',
      priority: 'medium',
      progress: 40,
      startDate: '2026-02-01',
      endDate: '2026-08-15',
      manager: 'Lee Manager',
      completedTasks: 8,
      totalTasks: 20,
    },
    {
      id: 3,
      name: 'AI 챗봇 구축',
      description: '고객 서비스용 AI 챗봇 시스템 구축',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      manager: 'Park Manager',
      completedTasks: 15,
      totalTasks: 15,
    },
    {
      id: 4,
      name: '보안 시스템 강화',
      description: '전사 보안 시스템 업그레이드 및 취약점 보완',
      status: 'planning',
      priority: 'high',
      progress: 10,
      startDate: '2024-04-01',
      endDate: '2024-07-31',
      manager: 'Choi Manager',
      completedTasks: 2,
      totalTasks: 18,
    }
  ])

  return (
    <div className="space-y-6">
      <ProjectHeader 
        onCreateProject={() => setIsCreateModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
      
      <ProjectStats projects={projects} />
      
      <ProjectFilters 
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      {/* 프로젝트 목록 */}
      <ProjectList 
        projects={projects}
        viewType={viewType}
        searchTerm={searchTerm}
        filters={filters}
        sortBy={sortBy}
        onProjectSelect={setSelectedProject}
        onProjectUpdate={setProjects}
      />

      {isCreateModalOpen && (
        <ProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          project={null}
          onSave={(newProject) => {
            setProjects([...projects, { ...newProject, id: Date.now() }])
            setIsCreateModalOpen(false)
          }}
        />
      )}

      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          onSave={(updatedProject) => {
            setProjects(projects.map(p => 
              p.id === updatedProject.id ? updatedProject : p
            ))
            setSelectedProject(null)
          }}
        />
      )}
    </div>
  )
}

export default ProjectManager