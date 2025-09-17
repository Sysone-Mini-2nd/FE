import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjects, 
  getProjectDetail, 
  createProject, 
  updateProject, 
  deleteProject, 
  analyzeRequirements, 
  createProjectMember, 
  deleteProjectMember 
} from '../api/projectAPI';
/** 작성자: 백승준 */
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
    // staleTime: 5 * 60 * 1000,
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

export function useAnalyzeRequirements() {
  return useMutation({ mutationFn: analyzeRequirements });
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

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useAddProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }) => createProjectMember(projectId, { memberId }), // 백엔드 API 형식에 맞게 body를 객체로 전달
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
}

export function useDeleteProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }) => deleteProjectMember(projectId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
}
