import React, { useState } from 'react'
import { Add, Close, Send, Person } from '@mui/icons-material'
import { employeesData } from '../../data/employees'
import { useFloatingChat } from '../../hooks/chat/useFloatingChat'
import useChatStore from '../../store/chatStore'

function TeamManagement() {
  const [selectedMember, setSelectedMember] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('팀 멤버')
  const [message, setMessage] = useState('')
  
  const getInitialTeamMembers = () => {
    // employeesData에서 특정 사원들을 선택하여 팀 역할 부여
    const initialTeamIds = [1, 5, 2] // 박서호, 김철수, 이지민의 ID
    const teamRoles = ['프로젝트 매니저', '팀 리더', '팀 멤버']
    const teamStatuses = ['offline','offline', 'offline']
    
    const initialTeam = initialTeamIds.map((id, index) => {
      const employee = employeesData.find(emp => emp.id === id)
      
      if (!employee) {
        return null
      }
      
      return {
        ...employee, // employeesData의 모든 정보 포함
        role: teamRoles[index],
        status: teamStatuses[index],
        avatar: employee.name[0]
      }
    }).filter(Boolean) // null 값 제거
    
    return initialTeam
  }
  
  const [teamMembers, setTeamMembers] = useState(() => {
    return getInitialTeamMembers()
  })

  // 채팅 훅 사용
  const { 
    addChatRoom, 
    findExistingPrivateChat, 
    toggleChat, 
    selectChatRoom,
    isOpen 
  } = useFloatingChat()

  // Zustand 채팅 Store 사용
  const { sendMessage } = useChatStore()

  const handleMemberClick = (member) => {
    setSelectedMember(member)
  }

  const handleCloseProfile = () => {
    setSelectedMember(null)
    setMessage('')
  }

  const handleSendMessage = () => {
    if (message.trim() && selectedMember) {
      // 기존 채팅방이 있는지 확인
      const existingChat = findExistingPrivateChat(selectedMember.name)
      
      let targetChat
      if (existingChat) {
        // 기존 채팅방이 있으면 해당 채팅방 사용
        targetChat = existingChat
      } else {
        // 새로운 채팅방 생성
        targetChat = {
          id: Date.now(),
          name: selectedMember.name,
          type: 'private',
          lastMessage: message,
          lastTime: '방금',
          unreadCount: 0,
          participants: [selectedMember.name]
        }
        addChatRoom(targetChat)
      }
      
      // 🔥 중요: 실제 메시지를 채팅 Store에 전송
      sendMessage(targetChat.id, message.trim())
      
      // 채팅방 선택하고 FloatingChat 열기
      selectChatRoom(targetChat)
      if (!isOpen) {
        toggleChat() // 채팅창이 닫혀있으면 열기
      }
      
      setMessage('')
      setSelectedMember(null)
    }
  }

  const handleAddMember = () => {
    if (selectedEmployeeId) {
      const selectedEmployee = employeesData.find(emp => emp.id === parseInt(selectedEmployeeId))
      
      // 이미 팀에 포함된 사원인지 확인
      const isAlreadyInTeam = teamMembers.some(member => member.name === selectedEmployee.name)
      
      if (!isAlreadyInTeam) {
        const newMember = {
          name: selectedEmployee.name,
          role: newMemberRole,
          status: 'offline',
          avatar: selectedEmployee.name[0],
          department: selectedEmployee.department,
          position: selectedEmployee.position
        }
        setTeamMembers([...teamMembers, newMember])
        setSelectedEmployeeId('')
        setNewMemberRole('팀 멤버')
        setShowAddModal(false)
      } else {
        alert('이미 팀에 포함된 사원입니다.')
      }
    }
  }

  // 팀에 포함되지 않은 사원들만 필터링
  const availableEmployees = employeesData.filter(employee => 
    !teamMembers.some(member => member.name === employee.name)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">팀 관리</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="createBtn"
        >
          <Add className="w-4 h-4" />
          팀원 추가
        </button>
      </div>
      
      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div 
            key={member.id || index} 
            onClick={() => handleMemberClick(member)}
            className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/90 cursor-pointer transition-all duration-200"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-medium rounded-full">
                {member.avatar || member.name?.[0] || '👤'}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-gray-600">{member.role || '팀 멤버'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 미니 프로필 모달 */}
      {selectedMember && (
        <div className="modal">
          <div className="bg-white rounded-md shadow-2xl w-80 max-w-[90vw] overflow-hidden">
            {/* 프로필 헤더 */}
            <div className="bg-gradient-to-br from-black/50 to-sky-500 p-6 text-white relative">
              <button
                onClick={handleCloseProfile}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <Close className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 bg-white/20 text-white flex items-center justify-center font-bold text-2xl rounded-full">
                    {selectedMember.avatar || selectedMember.name?.[0] || 'U'}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
                    selectedMember.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-white/80 text-sm">{selectedMember.role || '팀 멤버'}</p>
                {/* <div className="flex items-center gap-2 mt-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedMember.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm">
                    {selectedMember.status === 'online' ? '온라인' : '오프라인'}
                  </span>
                </div> */}
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">정보</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">역할:</span>
                  <span className="font-medium">{selectedMember.role || '팀 멤버'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태:</span>
                  <span className={`font-medium ${selectedMember.status === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedMember.status === 'online' ? '온라인' : '오프라인'}
                  </span>
                </div>
              </div>
            </div>

            {/* 메시지 전송 */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3">메시지 보내기</h4>
              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`${selectedMember.name}에게 메시지를 입력하세요...`}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows="3"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  메시지 전송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 팀원 추가 모달 */}
      {showAddModal && (
        <div className="modal">
          <div className="bg-white backdrop-blur-2xl rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">새 팀원 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사원 선택
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">사원을 선택하세요</option>
                  {availableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.department} · {employee.position})
                    </option>
                  ))}
                </select>
                {availableEmployees.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">추가할 수 있는 사원이 없습니다.</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  역할
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="팀 멤버">팀 멤버</option>
                  <option value="팀 리더">팀 리더</option>
                  <option value="프로젝트 매니저">프로젝트 매니저</option>
                  <option value="개발자">개발자</option>
                  <option value="디자이너">디자이너</option>
                  <option value="기획자">기획자</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddMember}
                disabled={!selectedEmployeeId || availableEmployees.length === 0}
                className="flex-1 px-4 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamManagement
