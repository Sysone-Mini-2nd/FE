import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getMeetings, deleteMeeting as deleteMeetingAPI, getMeetingDetail, createMeeting, updateMeeting } from '../api/meetingAPI';

// 회의록 목록 조회
export function useMeetings(projectId = 1, page = 1, size = 10) {
  return useQuery({
    queryKey: ['meetings', projectId, page, size],
    queryFn: () => getMeetings(projectId, page, size),
    staleTime: 2 * 60 * 1000, // 2분간 신선한 데이터
    cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
    refetchOnWindowFocus: true,
    select: (response) => {
      if (response.statusCode === 200) {
        return {
          meetings: response.data.content.map((meeting) => ({
            id: meeting.id,
            title: meeting.title,
            organizer: meeting.writerName,
            type: meeting.type,
            scheduledDate: meeting.progressTime,
            location: meeting.place,
            participants: [],
            participantCount: meeting.attendeeCount,
            description: meeting.content,
            createdAt: meeting.progressTime
          })),
          pagination: {
            page: response.data.page,
            size: response.data.size,
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
            hasNext: response.data.hasNext,
            hasPrevious: response.data.hasPrevious
          }
        };
      }
      throw new Error('Failed to fetch meetings');
    }
  });
}

// Suspense와 함께 사용할 회의록 목록
export function useSuspenseMeetings(projectId = 1, page = 1, size = 10) {
  return useSuspenseQuery({
    queryKey: ['meetings', projectId, page, size],
    queryFn: () => getMeetings(projectId, page, size),
    select: (response) => {
      console.log('API 응답:', response); // 디버깅용
      
      if (response?.statusCode === 200 && response?.data) {
        return {
          meetings: (response.data.content || []).map((meeting) => ({
            id: meeting.id,
            title: meeting.title,
            organizer: meeting.writerName,
            type: meeting.type,
            scheduledDate: meeting.progressTime,
            location: meeting.place,
            participants: [],
            participantCount: meeting.attendeeCount,
            description: meeting.content,
            createdAt: meeting.progressTime
          })),
          pagination: {
            page: response.data.page || 1,
            size: response.data.size || size,
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 1,
            hasNext: response.data.hasNext || false,
            hasPrevious: response.data.hasPrevious || false
          }
        };
      }
      
      // 응답이 예상과 다른 경우 기본값 반환
      console.warn('예상과 다른 API 응답:', response);
      return {
        meetings: [],
        pagination: {
          page: 1,
          size: size,
          totalElements: 0,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false
        }
      };
    }
  });
}

// 회의록 상세 조회
export function useMeetingDetail(projectId, meetingId, enabled = true) {
  return useQuery({
    queryKey: ['meeting-detail', projectId, meetingId],
    queryFn: () => getMeetingDetail(projectId, meetingId),
    enabled: enabled && !!meetingId,
    staleTime: 5 * 60 * 1000,
    select: (response) => {
      if (response.statusCode === 200) {
        return {
          id: meetingId,
          title: response.data.title,
          organizer: response.data.writerName,
          type: 'MEETING',
          scheduledDate: response.data.progressDate,
          location: response.data.place,
          participants: response.data.participants,
          participantCount: response.data.participants?.length || 0,
          content: response.data.content,
          description: response.data.content,
          memo: response.data.content,
          createdAt: response.data.progressDate,
        };
      }
      throw new Error('Failed to fetch meeting detail');
    }
  });
}

// 회의록 삭제 mutation
export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, meetingId }) => deleteMeetingAPI(projectId, meetingId),
    onMutate: async ({ projectId, meetingId }) => {
      // 진행 중인 쿼리들을 취소
      await queryClient.cancelQueries({ queryKey: ['meetings', projectId] });

      // 이전 데이터 백업
      const previousMeetings = queryClient.getQueryData(['meetings', projectId]);

      // 낙관적 업데이트: 즉시 UI에서 제거
      queryClient.setQueriesData(
        { queryKey: ['meetings', projectId] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            meetings: old.meetings.filter(meeting => meeting.id !== meetingId)
          };
        }
      );

      return { previousMeetings };
    },
    onError: (err, { projectId }, context) => {
      // 에러 발생시 이전 상태로 롤백
      if (context?.previousMeetings) {
        queryClient.setQueryData(['meetings', projectId], context.previousMeetings);
      }
    },
    onSettled: (data, error, { projectId }) => {
      // 완료 후 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['meetings', projectId] });
    }
  });
}

// 페이지 프리페칭 (다음 페이지 미리 로드)
export function usePrefetchNextPage(projectId, currentPage, totalPages, size = 10) {
  const queryClient = useQueryClient();

  const prefetchNextPage = () => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['meetings', projectId, currentPage + 1, size],
        queryFn: () => getMeetings(projectId, currentPage + 1, size),
        staleTime: 2 * 60 * 1000
      });
    }
  };

  return { prefetchNextPage };
}

// 회의록 생성 mutation
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, meetingData }) => createMeeting(projectId, meetingData),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.projectId] });
    },
    onError: (error) => {
      console.error('회의록 생성 실패:', error);
    }
  });
}

// 회의록 수정 mutation
export function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, meetingId, meetingData }) => updateMeeting(projectId, meetingId, meetingData),
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['meeting-detail', variables.projectId, variables.meetingId] });
    },
    onError: (error) => {
      console.error('회의록 수정 실패:', error);
    }
  });
}
