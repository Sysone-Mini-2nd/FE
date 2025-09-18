import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMembers, 
  createMember, 
  updateMember, 
  deleteMember 
} from '../api/memberAPI';
/** 작성자: 김대호 */
// 쿼리 키 정의
const QUERY_KEYS = {
  members: ['members'],
  member: (id) => ['members', id],
};

// React Query를 사용한 회원 관리 훅
export const useMemberQueries = () => {
  const queryClient = useQueryClient();

  // 회원 목록 조회 (자동 캐싱, 리페칭, 에러 핸들링)
  const {
    data: membersData,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.members,
    queryFn: async () => {
      const response = await getMembers();
      return response.data; 
    },
    suspense: true,
  });

  const members = membersData || [];

  // 회원 등록 뮤테이션
  const addMemberMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      // 성공 시 쿼리 무효화하여 자동 리페칭
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members });
    },
  });

  // 회원 수정 뮤테이션
  const editMemberMutation = useMutation({
    mutationFn: ({ id, data }) => updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members });
    },
  });

  // 회원 삭제 뮤테이션
  const deleteMemberMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members });
    },
  });

  // 기존 API와 호환되도록 래핑
  const addMember = async (memberData) => {
    return new Promise((resolve) => {
      addMemberMutation.mutate(memberData, {
        onSuccess: (data) => {
          resolve({ success: true, data });
        },
        onError: (error) => {
          resolve({ success: false, error: error.message });
        },
      });
    });
  };

  const editMember = async (memberId, memberData) => {
    return new Promise((resolve) => {
      editMemberMutation.mutate({ id: memberId, data: memberData }, {
        onSuccess: (data) => {
          resolve({ success: true, data });
        },
        onError: (error) => {
          resolve({ success: false, error: error.message });
        },
      });
    });
  };

  const removeMember = async (memberId) => {
    return new Promise((resolve) => {
      deleteMemberMutation.mutate(memberId, {
        onSuccess: () => {
          resolve({ success: true });
        },
        onError: (error) => {
          resolve({ success: false, error: error.message });
        },
      });
    });
  };

  return {
    members,
    loading,
    error,
    addMember,
    editMember,
    removeMember,
    
    // 추가 React Query 상태들
    isAdding: addMemberMutation.isPending,
    isEditing: editMemberMutation.isPending,
    isDeleting: deleteMemberMutation.isPending,
  };
};