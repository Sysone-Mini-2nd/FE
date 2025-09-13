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
        staleTime: 0, // 캐시를 즉시 stale로 처리하여 항상 최신 데이터 확인
        cacheTime: 5 * 60 * 1000, // 5분간 캐시 유지
        refetchOnWindowFocus: false, // 창 포커스 시 자동 refetch 비활성화
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

// 이슈 상세 조회
export function useIssueDetail(projectId, issueId) {
    return useQuery({
        queryKey: ['issues', projectId, issueId],
        queryFn: () => getIssueDetail(issueId),
        enabled: !!issueId, // issueId가 있을 때만 쿼리 실행
        select: (response) => response.data
    });
}

export function useCreateIssue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, issueData }) => createIssue(projectId, issueData),

        // 🟢 낙관적 업데이트: 서버 응답 기다리기 전에 UI에 반영
        onMutate: async ({ projectId, issueData }) => {
            await queryClient.cancelQueries(['issues', projectId]);

            // 이전 데이터 저장
            const previousIssues = queryClient.getQueryData(['issues', projectId]);

            // 낙관적으로 새로운 이슈 추가
            const optimisticIssue = {
                id: `temp-${Date.now()}`, // 임시 ID
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
                isOptimistic: true, // 임시 이슈 식별용 플래그
            };

            queryClient.setQueryData(['issues', projectId], (oldIssues = []) => [
                ...oldIssues,
                optimisticIssue,
            ]);

            return { previousIssues, projectId, tempId: optimisticIssue.id };
        },

        // 🟢 서버 요청 실패하면 롤백
        onError: (err, variables, context) => {
            if (context?.previousIssues) {
                queryClient.setQueryData(['issues', context.projectId], context.previousIssues);
            }
            console.error('이슈 생성 실패:', err);
        },

        // 🟢 서버 요청 성공 시 실제 데이터로 교체
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
                    // 임시 이슈를 실제 이슈로 교체
                    if (issue.isOptimistic || issue.id === context?.tempId) {
                        return newIssue;
                    }
                    return issue;
                });
            });

            console.log('✅ 새로운 이슈 생성 완료:', newIssue);
        },

        // 🟢 서버 데이터 최종 동기화
        onSettled: (_, __, { projectId }) => {
            // 약간의 지연을 두고 무효화하여 대기 중인 업데이트가 처리될 시간을 확보
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
            queryClient.invalidateQueries({ queryKey: ['issues', variables.projectId, variables.issueId] });
            console.log('✅ 이슈 업데이트 완료:', variables.issueId);
        },
        onError: (error, variables) => {
            console.error('이슈 업데이트 실패:', error, variables);
        }
    });
}

// 이슈 삭제 mutation
export function useDeleteIssue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ issueId }) => deleteIssueAPI(issueId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['issues', variables.projectId] });
            console.log('✅ 이슈 삭제 완료:', variables.issueId);
        },
        onError: (error, variables) => {
            console.error('이슈 삭제 실패:', error, variables);
        }
    });
}