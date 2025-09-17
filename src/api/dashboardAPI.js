import api from './client.js';
/** 작성자: 김대호 */
/**
 * 대시보드 프로젝트 리스트를 가져오는 API 함수
 * @returns {Promise<Object>} 프로젝트 데이터가 포함된 응답 객체
 */
export const fetchDashboardProjects = async () => {
  try {
    const response = await api.get('/dashboards');
    return response.data;
  } catch (error) {
    console.error('대시보드 프로젝트 데이터 로딩 실패:', error);
    throw error;
  }
};

// /**
//  * 특정 프로젝트의 상세 정보를 가져오는 API 함수
//  * @param {number} projectId - 프로젝트 ID
//  * @returns {Promise<Object>} 프로젝트 상세 데이터
//  */
// export const fetchProjectDetail = async (projectId) => {
//   try {
//     const response = await api.get(`/projects/${projectId}`);
//     return response.data;
//   } catch (error) {
//     console.error('프로젝트 상세 데이터 로딩 실패:', error);
//     throw error;
//   }
// };

/**
 * 특정 프로젝트의 대시보드 데이터를 가져오는 API 함수
 * @param {number} projectId - 프로젝트 ID
 * @returns {Promise<Object>} 프로젝트 대시보드 데이터 (차트, 일정, 우선순위 등)
 */
export const fetchProjectDashboard = async (projectId) => {
  try {
    const response = await api.get(`/dashboards/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('프로젝트 대시보드 데이터 로딩 실패:', error);
    throw error;
  }
};