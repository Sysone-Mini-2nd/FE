import React, { useState, useMemo } from 'react';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectStats from '../components/project/ProjectStats';
import ProjectFilters from '../components/project/ProjectFilters';
import ProjectList from '../components/project/ProjectList';
import ProjectModal from '../components/project/ProjectModal';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useProjectQueries';
import { useMemberQueries } from '../hooks/useMemberQueries';

const statusMap = {
  planning: 'TODO',
  progress: 'IN_PROGRESS',
  completed: 'DONE',
  paused: 'PAUSED',
};

const priorityMap = {
  low: 'LOW',
  medium: 'NORMAL',
  high: 'HIGH',
};

function ProjectManager() {
  const [viewType, setViewType] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });
  const [sortBy, setSortBy] = useState('created');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const apiFilters = useMemo(() => ({
    search: searchTerm,
    status: filters.status === 'all' ? null : statusMap[filters.status],
    priority: filters.priority === 'all' ? null : priorityMap[filters.priority],
    sort: sortBy,
  }), [searchTerm, filters, sortBy]);

  const { data: projectData, isLoading: projectsLoading, isError: projectsError } = useProjects(apiFilters);
  const { members: allMembers, loading: membersLoading, error: membersError } = useMemberQueries();

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const handleDeleteProject = (projectId) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까? 데이터는 복구할 수 없습니다.')) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  return (
    <div className="space-y-6">
      <ProjectHeader 
        onCreateProject={() => setIsCreateModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
      
      {projectsLoading || membersLoading ? (
        <div>데이터를 불러오는 중...</div>
      ) : projectsError || membersError ? (
        <div>에러가 발생했습니다.</div>
      ) : (
        <>
          {/* 1. ProjectStats에 필요한 모든 통계 데이터를 props로 전달합니다. */}
          <ProjectStats 
            total={projectData.total}
            stats={projectData.statusCounts}
            delayed={projectData.delayed}
          />
          
          <ProjectFilters 
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          <ProjectList 
            projects={projectData.projects}
            viewType={viewType}
            onProjectSelect={setSelectedProject}
            onProjectDelete={handleDeleteProject}
          />
        </>
      )}

      {isCreateModalOpen && (
        <ProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          project={null}
          allMembers={allMembers}
          onSave={(newProject) => {
            const translatedProject = {
              ...newProject,
              status: statusMap[newProject.status],
              priority: priorityMap[newProject.priority],
            };
            createProjectMutation.mutate(translatedProject);
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          allMembers={allMembers}
          onSave={(updatedProject) => {
            const translatedProject = {
              ...updatedProject,
              status: statusMap[updatedProject.status],
              priority: priorityMap[updatedProject.priority],
            };
            updateProjectMutation.mutate(translatedProject);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  )
}

export default ProjectManager;
