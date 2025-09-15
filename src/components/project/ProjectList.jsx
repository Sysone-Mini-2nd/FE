import React, {useContext} from 'react';
import ProjectCard from './ProjectCard';
import ProjectTable from './ProjectTable';
// 1. 삭제 기능을 위해 useDeleteProject 훅을 import 합니다.
import { useDeleteProject } from '../../hooks/useProjectQueries';
import AuthContext from "../../contexts/AuthContext.jsx";

function ProjectList({ 
  projects,
  viewType,
  onProjectSelect,
}) {
  // 2. 삭제 뮤테이션 훅을 호출합니다.
  const deleteProjectMutation = useDeleteProject();
  const { user } = useContext(AuthContext); // 현재 사용자 정보 가져오기

  const handleProjectAction = (action, project) => {
    switch (action) {
      case 'view':
      case 'edit':
        onProjectSelect(project);
        break;
      // 3. 'delete' 액션이 들어왔을 때, 뮤테이션을 실행합니다.
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
