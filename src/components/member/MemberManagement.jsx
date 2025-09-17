import { useState } from 'react';
import { useMemberQueries } from '../../hooks/useMemberQueries';
import { useToast } from '../../hooks/useToast';
import MemberTable from './MemberTable';
import MemberModal from './MemberModal';
import MemberHeader from './MemberHeader';
import ConfirmDialog from '../common/ConfirmDialog';
/** 작성자: 김대호 */
function MemberManagement() {
  const {
    members,
    loading,
    error,
    addMember,
    editMember,
    removeMember,
    isAdding,
    isEditing,
    isDeleting
  } = useMemberQueries();

  const { showSuccess, showError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });
  const [formData, setFormData] = useState({
    accountId: '',
    password: '',
    role: 'USER',
    email: '',
    name: '',
    picUrl: '',
    position: '사원'
  });

  // 폼 데이터 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 새 회원 등록 모달 열기
  const handleCreateMember = () => {
    setEditingMember(null);
    setFormData({
      accountId: '',
      password: '',
      role: 'USER',
      email: '',
      name: '',
      picUrl: '',
      position: '사원'
    });
    setIsModalOpen(true);
  };

  // 회원 정보 수정 모달 열기
  const handleEditMember = (member) => {
    setEditingMember(member);
    setFormData({
      accountId: member.accountId,
      password: '', 
      role: member.role,
      email: member.email,
      name: member.name,
      picUrl: member.picUrl || '',
      position: member.position || '사원'
    });
    setIsModalOpen(true);
  };

  // 회원 삭제
  const handleDeleteMember = async (member) => {
    setConfirmDialog({
      isOpen: true,
      title: '회원 삭제',
      message: `정말로 ${member.name} 회원을 삭제하시겠습니까?\n삭제된 회원 정보는 복구할 수 없습니다.`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        const result = await removeMember(member.id);
        if (result.success) {
          showSuccess('회원이 성공적으로 삭제되었습니다.');
        } else {
          showError('회원 삭제에 실패했습니다: ' + result.error);
        }
      }
    });
  };

  // 폼 제출 핸들러 (React Query의 뮤테이션 상태 활용)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 이미 처리 중이면 중복 방지
    if (isAdding || isEditing) return;
    
    let result;
    if (editingMember) {
      // 수정 시에는 비밀번호 제외
      const updateData = { ...formData };
      delete updateData.password;
      result = await editMember(editingMember.id, updateData);
    } else {
      // 신규 등록
      result = await addMember(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      showSuccess(editingMember ? '회원 정보가 수정되었습니다.' : '새 회원이 등록되었습니다.');
    } else {
      showError('작업에 실패했습니다: ' + result.error);
    }
  };
  
  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // 확인 다이얼로그 닫기
  const handleCloseConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">회원 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-red-500">오류: {error.message || error}</div>
        <p className="text-sm text-gray-600">페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MemberHeader 
        onCreateMember={handleCreateMember}
      />
      
      <MemberTable 
        members={members}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        isDeleting={isDeleting}
      />

      <MemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingMember={editingMember}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        isSubmitting={isAdding || isEditing}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCloseConfirmDialog}
      />
    </div>
  );
}

export default MemberManagement;