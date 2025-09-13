import api from './client';

// 프로젝트 목록 조회
export const getProjects = async (filters = {}) => {
  try {
    const response = await api.get(`/projects`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error);
    throw error;
  }
};

// 프로젝트 상세 조회
export const getProjectDetail = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('프로젝트 상세 조회 실패:', error);
    throw error;
  }
};

// 프로젝트 생성
export const createProject = async (projectData) => {
  try {
    const response = await api.post(`/projects`, projectData);
    return response.data;
  } catch (error) {
    console.error('프로젝트 생성 실패:', error);
    throw error;
  }
};

// 프로젝트 수정 (PUT)
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('프로젝트 수정 실패:', error);
    throw error;
  }
};

// 프로젝트 삭제
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
};
