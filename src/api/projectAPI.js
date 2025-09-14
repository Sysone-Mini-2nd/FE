import api from './client';

export const getProjects = async (params = {}) => {
  try {
    const response = await api.get('/projects', { params });
    return response.data;
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error);
    throw error;
  }
};

export const getProjectDetail = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`프로젝트 상세 조회 실패 (ID: ${projectId}):`, error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('프로젝트 생성 실패:', error);
    throw error;
  }
};

export const updateProject = async (projectData) => {
  try {
    const { id, ...data } = projectData;
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('프로젝트 수정 실패:', error);
    throw error;
  }
};

/**
 * 프로젝트를 삭제합니다.
 * @param {string | number} projectId - 삭제할 프로젝트의 ID
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`프로젝트 삭제 실패 (ID: ${projectId}):`, error);
    throw error;
  }
};
