import { useState } from 'react';
import { useMemberQueries } from '../../hooks/useMemberQueries';
import MemberTable from './MemberTable';
import MemberModal from './MemberModal';
import MemberHeader from './MemberHeader';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
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
      password: '', // 수정 시에는 비밀번호 필드 비움
      role: member.role,
      email: member.email,
      name: member.name,
      picUrl: member.picUrl || '',
      position: member.position || '사원'
    });
    setIsModalOpen(true);
  };

  // 회원 삭제
  const handleDeleteMember = async (memberId) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      const result = await removeMember(memberId);
      if (result.success) {
        alert('회원이 성공적으로 삭제되었습니다.');
      } else {
        alert('회원 삭제에 실패했습니다: ' + result.error);
      }
    }
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
      alert(editingMember ? '회원 정보가 수정되었습니다.' : '새 회원이 등록되었습니다.');
    } else {
      alert('작업에 실패했습니다: ' + result.error);
    }
  };
  
  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
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
    </div>
  );
}

export default MemberManagement;