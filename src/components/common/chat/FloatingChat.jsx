import React, { useEffect } from 'react';
import { useFloatingChat } from '../../../hooks/chat/useFloatingChat';
import { useAuth } from '../../../hooks/useAuth';
import useChatStore from '../../../store/chatStore';
import FloatingChatButton from './FloatingChatButton';
import ChatHeader from './ChatHeader';
import ChatRoomList from './ChatRoomList';
import EmployeeSearch from './EmployeeSearch';
import ChatRoom from './ChatRoom';
import ContextMenu from './ContextMenu';
import { ExitToApp } from '@mui/icons-material';

function FloatingChat() {
  const { user } = useAuth();
  const { setCurrentUser } = useChatStore();
  
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user, setCurrentUser]);
  
  const {
    isOpen, isMinimized, message, setMessage, currentView, selectedChat, toggleChat, 
    selectChatRoom, backToList, toggleMinimize, handleSendMessage, searchTerm, setSearchTerm,
    filteredChatRooms, employeeSearchTerm, setEmployeeSearchTerm, selectedEmployees, 
    handleToggleEmployee, filteredEmployees, handleCreateGroupChat, handleGoToCreateChat,
    groupName, setGroupName, contextMenu, handleContextMenu, closeContextMenu, handleLeaveChatRoom, totalUnreadCount,
    isInviteMode, handleOpenInviteMode
  } = useFloatingChat();

  const menuItems = [
    {
      label: '채팅방 나가기',
      action: handleLeaveChatRoom,
      icon: <ExitToApp fontSize="small" />,
      isDestructive: true,
    }
  ];

  return (
    <>
      {/* 아이콘은 항상 렌더링되도록 바깥으로 이동 */}
      <div className="fixed bottom-6 right-6 z-40">
        <FloatingChatButton onClick={toggleChat} unreadCount={totalUnreadCount} />
      </div>

      {/* 채팅 창의 표시 여부만 isOpen으로 제어 */}
      <div className={`fixed bottom-24 right-6 z-50 rounded-lg shadow-xl h-2/3 backdrop-blur-sm transition-all duration-300 ease-in-out flex flex-col ${
        isOpen 
          ? `opacity-100 scale-100 translate-y-0` 
          : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
      }`}>
          {!isMinimized ? (
            <>
              <div className="flex-shrink-0">
                <ChatHeader
                  currentView={currentView}
                  selectedChat={selectedChat}
                  isMinimized={isMinimized}
                  onBackToList={backToList}
                  onToggleMinimize={toggleMinimize}
                  onToggleChat={toggleChat}
                  onOpenInviteMode={handleOpenInviteMode} // onOpenInviteMode 핸들러 전달
                />
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                {currentView === 'list' ? (
                  <ChatRoomList
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filteredChatRooms={filteredChatRooms}
                    onSelectChatRoom={selectChatRoom}
                    onGoToCreateChat={handleGoToCreateChat}
                    onContextMenu={handleContextMenu}
                  />
                ) : currentView === 'createChat' ? (
                  <EmployeeSearch
                    employeeSearchTerm={employeeSearchTerm}
                    onSearchChange={setEmployeeSearchTerm}
                    filteredEmployees={filteredEmployees}
                    selectedEmployees={selectedEmployees}
                    onToggleEmployee={handleToggleEmployee}
                    onCreateGroupChat={handleCreateGroupChat}
                    groupName={groupName}
                    onGroupNameChange={setGroupName}
                  />
                ) : (
                  <ChatRoom
                    selectedChat={selectedChat}
                    message={message}
                    onMessageChange={setMessage}
                    onSendMessage={handleSendMessage}
                  />
                )}
              </div>
            </>
          ) : (
            // 최소화 상태일 때의 UI (헤더만 표시)
            <div className="flex-shrink-0">
              <ChatHeader
                currentView={currentView}
                selectedChat={selectedChat}
                isMinimized={isMinimized}
                onBackToList={backToList}
                onToggleMinimize={toggleMinimize}
                onToggleChat={toggleChat}
              />
            </div>
          )}
        </div>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        items={menuItems}
        onClose={closeContextMenu}
      />
    </>
  );
}

export default FloatingChat;