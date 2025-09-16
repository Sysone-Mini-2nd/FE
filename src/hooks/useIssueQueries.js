import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjectIssues,
    getIssueDetail,
    createIssue,
    updateIssue, // PUT 요청용
    patchIssue,  // PATCH 요청용
    deleteIssue as deleteIssueAPI
} from '../api/projectIssueAPI';

// 이슈 목록 조회 (필터링, 검색 지원)
export function useProjectIssues(projectId, filters = {}) {
    return useQuery({
        queryKey: ['issues', projectId, filters],
        queryFn: () => getProjectIssues(projectId, filters),
        staleTime: 0, 
        // cacheTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: false, 
        select: (response) => {
            if (response && response.data && Array.isArray(response.data.issues)) {
                return response.data.issues.map((issue) => ({
                    id: issue.id,
                    title: issue.title,
                    desc: issue.desc,
                    memberName: issue.memberName,
                    memberId: issue.memberId,
                    status: issue.status,
                    priority: issue.priority,
                    startDate: issue.startDate,
                    endDate: issue.endDate,
                    tags: issue.tags,
                    dDay: issue.dday,
                }));
            }
            return [];
        }
    });
}

// 이슈 상세 조회 (projectId 파라미터 제거)
export function useIssueDetail(issueId) {
    return useQuery({
        // queryKey에서도 projectId 제거
        queryKey: ['issues', issueId],
        queryFn: () => getIssueDetail(issueId),
        enabled: !!issueId, // issueId가 있을 때만 쿼리 실행
        select: (response) => response.data // API 응답에서 실제 데이터만 선택
    });
}

// 이슈 생성 mutation (사용자 요청에 따라 이 부분은 수정하지 않습니다)
export function useCreateIssue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, issueData }) => createIssue(projectId, issueData),

        onMutate: async ({ projectId, issueData }) => {
            await queryClient.cancelQueries(['issues', projectId]);
            const previousIssues = queryClient.getQueryData(['issues', projectId]);
            const optimisticIssue = {
                id: `temp-${Date.now()}`,
                title: issueData.title,
                desc: issueData.desc,
                memberName: issueData.memberName,
                memberId: issueData.memberId,
                status: issueData.status,
                priority: issueData.priority,
                startDate: issueData.startDate,
                endDate: issueData.endDate,
                tags: issueData.tags || [],
                dDay: issueData.dday || null,
                isOptimistic: true,
            };
            queryClient.setQueryData(['issues', projectId], (oldIssues = []) => [
                ...oldIssues,
                optimisticIssue,
            ]);
            return { previousIssues, projectId, tempId: optimisticIssue.id };
        },

        onError: (err, variables, context) => {
            if (context?.previousIssues) {
                queryClient.setQueryData(['issues', context.projectId], context.previousIssues);
            }
            console.error('이슈 생성 실패:', err);
        },

        onSuccess: (response, variables, context) => {
            const newIssue = {
                id: response.data.id,
                title: response.data.title,
                desc: response.data.desc,
                memberName: response.data.memberName,
                memberId: response.data.memberId,
                status: response.data.status,
                priority: response.data.priority,
                startDate: response.data.startDate,
                endDate: response.data.endDate,
                tags: response.data.tags,
                dDay: response.data.dday,
            };
            queryClient.setQueryData(['issues', variables.projectId], (oldIssues = []) => {
                return oldIssues.map((issue) => {
                    if (issue.isOptimistic || issue.id === context?.tempId) {
                        return newIssue;
                    }
                    return issue;
                });
            });
            console.log('✅ 새로운 이슈 생성 완료:', newIssue);
        },

        onSettled: (_, __, { projectId }) => {
            setTimeout(() => {
                queryClient.invalidateQueries(['issues', projectId]);
            }, 200);
        },
    });
}

// 이슈 수정 mutation (PUT & PATCH 분기 처리)
export function useUpdateIssue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ issueId, issueData, isPatch = false }) => {
            if (isPatch) {
                return patchIssue(issueId, issueData);
            } else {
                return updateIssue(issueId, issueData);
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['issues', variables.projectId] });
            queryClient.invalidateQueries({ queryKey: ['issues', variables.issueId] });
        },
    });
}

// 이슈 삭제 mutation
export function useDeleteIssue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ issueId }) => deleteIssueAPI(issueId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['issues', variables.projectId] });
        },
    });
}
