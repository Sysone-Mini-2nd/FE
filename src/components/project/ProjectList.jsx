import React, {useContext, Suspense} from 'react';
import ProjectTable from './ProjectTable';
import { useDeleteProject } from '../../hooks/useProjectQueries';
import AuthContext from "../../contexts/AuthContext.jsx";
import { ProjectCardSkeleton } from '../common/loading/LoadingComponents';
/** 작성자: 김대호, 백승준 */
// Lazy load ProjectCard component
const ProjectCard = React.lazy(() => import('./ProjectCard'));

function ProjectList({ 
  projects,
  viewType,
  onProjectSelect,
}) {
  const deleteProjectMutation = useDeleteProject();
  const { user } = useContext(AuthContext); // 현재 사용자 정보 가져오기

  const handleProjectAction = (action, project) => {
    switch (action) {
      case 'view':
      case 'edit':
        onProjectSelect(project);
        break;
      case 'delete':
        if (window.confirm(`정말로 '${project.name}' 프로젝트를 삭제하시겠습니까?`)) {
          deleteProjectMutation.mutate(project.id);
        }
        break;
      default:
        console.log('Unhandled action:', action);
        break;
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
        <p className="text-gray-500">
          표시할 프로젝트가 없거나, 새 프로젝트를 생성하여 시작해보세요.
        </p>
      </div>
    );
  }

  switch (viewType) {
    case 'card':
      return (
        <Suspense fallback={<ProjectCardSkeleton count={projects.length} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onAction={handleProjectAction}
                isPm={project?.pmId === user?.id}
                user={user}
              />
            ))}
          </div>
        </Suspense>
      );
    
    case 'table':
      return (
        <ProjectTable
          projects={projects}
          onAction={handleProjectAction}
          user={user}
        />
      );
    
    default:
      return null;
  }
}

export default ProjectList;
