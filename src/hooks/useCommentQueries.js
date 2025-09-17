import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, updateComment, deleteComment } from '../api/commentAPI';
/** 작성자: 백승준 */
// 댓글 목록 조회
export function useGetComments(issueId) {
  return useQuery({
    queryKey: ['comments', issueId],
    queryFn: () => getComments(issueId),
    enabled: !!issueId, // issueId가 있을 때만 쿼리 실행
    select: (response) => response.data || [], // API 응답에서 실제 데이터만 선택, 없으면 빈 배열
  });
}

// 댓글 생성
export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment, // commentData 객체를 그대로 전달
    onSuccess: (data, variables) => {
      // 댓글 생성 성공 시 해당 이슈의 댓글 목록 쿼리를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', variables.issueId] });
    },
  });
}

// 댓글 수정
export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

// 댓글 삭제
export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
