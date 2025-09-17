import api from './client';
/** 작성자: 백승준 */
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

export const analyzeRequirements = async (formData) => {
  try {
    const response = await api.post('/requirements/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('요구사항 분석 실패:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`프로젝트 삭제 실패 (ID: ${projectId}):`, error);
    throw error;
  }
};

// --- 팀원 추가/삭제 API 수정 ---

export const createProjectMember = async (projectId, memberId) => {
  try {
    const response = await api.post(`/projects/${projectId}/members`, memberId);
    return response.data;
  } catch (error) {
    console.error(`프로젝트 멤버 생성 실패 (ID: ${projectId}):`, error);
    throw error;
  }
};

export const deleteProjectMember = async (projectId, memberId) => {
  try {
    const response = await api.delete(`/projects/${projectId}/members`, { data: { memberId } });
    return response.data;
  } catch (error) {
    console.error(`프로젝트 멤버 삭제 실패 (ID: ${projectId}):`, error);
    throw error;
  }
};
