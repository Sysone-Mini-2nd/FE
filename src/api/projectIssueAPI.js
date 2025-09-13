import api from './client';

// 이슈 목록 조회 (필터링, 검색 지원)
export const getProjectIssues = async (projectId, filters = {}) => {
    try {
        const response = await api.get(`/projects/${projectId}/issues`, {
            params: filters
        });
        return response.data;
    } catch (error) {
        console.error('이슈 목록 조회 실패:', error);
        throw error;
    }
};

// 이슈 상세 조회
export const getIssueDetail = async (issueId) => {
    try {
        const response = await api.get(`/issues/${issueId}`);
        return response.data;
    } catch (error) {
        console.error('이슈 상세 조회 실패:', error);
        throw error;
    }
};

// 이슈 생성
export const createIssue = async (projectId, issueData) => {
    try {
        const response = await api.post(`/projects/${projectId}/issues`, issueData);
        return response.data;
    } catch (error) {
        console.error('이슈 생성 실패:', error);
        throw error;
    }
};

// 이슈 전체 수정 (PUT)
export const updateIssue = async (issueId, issueData) => {
    try {
        const response = await api.put(`/issues/${issueId}`, issueData);
        return response.data;
    } catch (error) {
        console.error('이슈 수정 실패:', error);
        throw error;
    }
};

// 이슈 부분 수정 (PATCH)
export const patchIssue = async (issueId, issueData) => {
    try {
        const response = await api.patch(`/issues/${issueId}`, issueData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('이슈 부분 수정 실패:', error);
        throw error;
    }
};

// 이슈 삭제
export const deleteIssue = async (issueId) => {
    try {
        const response = await api.delete(`/issues/${issueId}`);
        return response.data;
    } catch (error) {
        console.error('이슈 삭제 실패:', error);
        throw error;
    }
};
