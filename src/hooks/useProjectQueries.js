import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// 1. deleteProject 함수를 추가로 import 합니다.
import { getProjects, getProjectDetail, createProject, updateProject, deleteProject } from '../api/projectAPI';

export function useProjects(filters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
    select: (response) => {
      if (response && response.data) {
        return response.data;
      }
      return { projects: [], total: 0, statusCounts: {}, delayed: 0 };
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}

export function useProjectDetail(projectId) {
  return useQuery({
    queryKey: ['projects', projectId],
    enabled: !!projectId,
    queryFn: () => getProjectDetail(projectId),
    select: (response) => {
      if (response && response.data) {
        return response.data;
      }
      return null;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
}

/**
 * 프로젝트 삭제를 위한 뮤테이션 훅
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // 성공 시 'projects' 쿼리를 무효화하여 목록을 자동으로 새로고침합니다.
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
