import React, {useState, useMemo, useContext} from 'react';
import { Add, Close, Send, Delete } from '@mui/icons-material';
import { useFloatingChat } from '../../hooks/chat/useFloatingChat';
import useChatStore from '../../store/chatStore';
import { useMemberQueries } from '../../hooks/useMemberQueries';
import { useAddProjectMember, useDeleteProjectMember } from '../../hooks/useProjectQueries';
import AuthContext from "../../contexts/AuthContext.jsx";
/** 작성자: 김대호, 백승준 */
function TeamManagement({ members: teamMembers = [], isPM, projectId }) {
  const { user } = useContext(AuthContext);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [message, setMessage] = useState('');

  const { members: allEmployees, loading: isLoadingMembers } = useMemberQueries();
  
  const addMemberMutation = useAddProjectMember();
  const deleteMemberMutation = useDeleteProjectMember();

  const { addChatRoom, findExistingPrivateChat, toggleChat, selectChatRoom, isOpen } = useFloatingChat();
  const { sendMessage } = useChatStore();

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseProfile = () => {
    setSelectedMember(null);
    setMessage('');
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedMember) {
      const existingChat = findExistingPrivateChat(selectedMember.name);
      let targetChat;
      if (existingChat) {
        targetChat = existingChat;
      } else {
        targetChat = {
          id: Date.now(),
          name: selectedMember.name,
          type: 'private',
          lastMessage: message,
          lastTime: '방금',
          unreadCount: 0,
          participants: [selectedMember.name]
        };
        addChatRoom(targetChat);
      }
      sendMessage(targetChat.id, message.trim());
      selectChatRoom(targetChat);
      if (!isOpen) {
        toggleChat();
      }
      setMessage('');
      setSelectedMember(null);
    }
  };

  const handleAddMember = () => {
    if (selectedEmployeeId) {
      addMemberMutation.mutate({ projectId, memberId: parseInt(selectedEmployeeId, 10) });
      setSelectedEmployeeId('');
      setShowAddModal(false);
    }
  };

  const handleDeleteMember = (e, memberId) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 팀원을 프로젝트에서 제외하시겠습니까?")) {
      deleteMemberMutation.mutate({ projectId, memberId });
    }
  };

  const availableEmployees = useMemo(() => {
    if (!allEmployees || !teamMembers) return [];
    const teamMemberIds = new Set(teamMembers.map(member => member.id));
    return allEmployees.filter(employee => !teamMemberIds.has(employee.id));
  }, [allEmployees, teamMembers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">팀 관리</h3>
        {(isPM || user.role === 'MASTER') && (
          <button onClick={() => setShowAddModal(true)} className="createBtn">
            <Add className="w-4 h-4" />
            팀원 추가
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div 
            key={member.id || index} 
            onClick={() => handleMemberClick(member)}
            className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/90 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-medium rounded-full">
                  {member.picUrl ? <img src={member.picUrl} alt={member.name} className="rounded-full w-full h-full object-cover" /> : (member.name?.[0] || '👤')}
                </div>
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-600">{member.role === 'PM' ? '프로젝트 매니저' : '팀 멤버'}</div>
              </div>
            </div>
            {(isPM || user.role === 'MASTER') && (
              <td className="px-6 py-4 text-right">
                {/* PM 자신은 삭제할 수 없도록 처리 */}
                {member.role !== 'PM' && (
                  <button onClick={(e) => handleDeleteMember(e, member.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                    <Delete className="w-5 h-5" />
                  </button>
                )}
              </td>
            )}
          </div>
        ))}
      </div>

      {/* 미니 프로필 모달 (기존 UI 유지) */}
      {selectedMember && (
         <div className="modal">
          <div className="bg-white rounded-md shadow-2xl w-80 max-w-[90vw] overflow-hidden">
            <div className="bg-gradient-to-br from-black/50 to-sky-500 p-6 text-white relative">
              <button onClick={handleCloseProfile} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"><Close className="w-5 h-5" /></button>
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 bg-white/20 text-white flex items-center justify-center font-bold text-2xl rounded-full">
                    {selectedMember.picUrl ? <img src={selectedMember.picUrl} alt={selectedMember.name} className="rounded-full w-full h-full object-cover"/> : (selectedMember.name?.[0] || 'U')}
                  </div>
                </div>
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-white/80 text-sm">{selectedMember.role === 'PM' ? '프로젝트 매니저' : '팀 멤버'}</p>
              </div>
            </div>
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">정보</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">역할:</span><span className="font-medium">{selectedMember.role === 'PM' ? '프로젝트 매니저' : '팀 멤버'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">직책:</span><span className="font-medium">{selectedMember.position || '미지정'}</span></div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3">메시지 보내기</h4>
              <div className="space-y-3">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`${selectedMember.name}에게 메시지를 입력하세요...`} className="w-full p-3 border border-gray-300 rounded-lg resize-none" rows="3" />
                <button onClick={handleSendMessage} disabled={!message.trim()} className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"><Send className="w-4 h-4" />메시지 전송</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 팀원 추가 모달 (데이터 소스 변경) */}
      {showAddModal && (
        <div className="modal">
          <div className="bg-white backdrop-blur-2xl rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">새 팀원 추가</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><Close className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사원 선택</label>
                <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">사원을 선택하세요</option>
                  {isLoadingMembers ? (
                    <option disabled>사원 목록을 불러오는 중...</option>
                  ) : (
                    availableEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name} ({employee.position || '직책 없음'})</option>
                    ))
                  )}
                </select>
                {!isLoadingMembers && availableEmployees.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">추가할 수 있는 사원이 없습니다.</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleAddMember} disabled={!selectedEmployeeId || isLoadingMembers || availableEmployees.length === 0} className="flex-1 px-4 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-white rounded-lg transition-colors">추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
