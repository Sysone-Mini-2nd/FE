import { useChat } from './useChat'
import { useChatRooms } from './useChatRooms'
import { useEmployees } from './useEmployees'

export const useFloatingChat = () => {
  const chatHook = useChat()
  const chatRoomsHook = useChatRooms()
  const employeesHook = useEmployees()

  // 채팅방 생성 로직
  const handleSelectEmployee = (employee) => {
    const existingChat = chatRoomsHook.findExistingPrivateChat(employee.name)
    
    if (existingChat) {
      chatHook.selectChatRoom(existingChat)
    } else {
      const newChat = {
        id: Date.now(),
        name: employee.name,
        type: 'private',
        lastMessage: '새로운 채팅이 시작되었습니다.',
        lastTime: '방금',
        unreadCount: 0,
        participants: [employee.name]
      }
      chatRoomsHook.addChatRoom(newChat)
      chatHook.selectChatRoom(newChat)
    }
  }

  const handleCreateGroupChat = () => {
    if (employeesHook.selectedEmployees.length === 1) {
      handleSelectEmployee(employeesHook.selectedEmployees[0])
    } else if (employeesHook.selectedEmployees.length > 1) {
      const groupName = employeesHook.selectedEmployees.map(emp => emp.name).join(', ')
      const newChat = {
        id: Date.now(),
        name: groupName,
        type: 'group',
        lastMessage: '그룹 채팅이 시작되었습니다.',
        lastTime: '방금',
        unreadCount: 0,
        participants: employeesHook.selectedEmployees.map(emp => emp.name)
      }
      chatRoomsHook.addChatRoom(newChat)
      chatHook.selectChatRoom(newChat)
    }
    employeesHook.clearSelectedEmployees()
  }

  const handleGoToCreateChat = () => {
    chatHook.goToCreateChat()
    employeesHook.clearSelectedEmployees()
  }

  return {
    ...chatHook,
    ...chatRoomsHook,
    ...employeesHook,
    handleSelectEmployee,
    handleCreateGroupChat,
    handleGoToCreateChat
  }
}
