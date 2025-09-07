import React from 'react'
import { useFloatingChat } from '../../../hooks/chat/useFloatingChat'
import FloatingChatButton from './FloatingChatButton'
import ChatHeader from './ChatHeader'
import ChatRoomList from './ChatRoomList'
import EmployeeSearch from './EmployeeSearch'
import ChatRoom from './ChatRoom'

function FloatingChat() {
  const {
    isOpen,
    isMinimized,
    message,
    setMessage,
    currentView,
    selectedChat,
    toggleChat,
    selectChatRoom,
    backToList,
    goToCreateChat,
    toggleMinimize,
    handleSendMessage,
    searchTerm,
    setSearchTerm,
    filteredChatRooms,
    employeeSearchTerm,
    setEmployeeSearchTerm,
    selectedEmployees,
    handleToggleEmployee,
    filteredEmployees,
    handleSelectEmployee,
    handleCreateGroupChat,
    handleGoToCreateChat
  } = useFloatingChat()

  return (
    <>
      {/* 채팅 아이콘 */}
      {!isOpen && (
        <FloatingChatButton onClick={toggleChat} />
      )}

      {/* 채팅 창 */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg shadow-xl backdrop-blur-sm transition-all duration-300 ${
          isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
        }`}>
          {/* 채팅 헤더 */}
          <ChatHeader
            currentView={currentView}
            selectedChat={selectedChat}
            isMinimized={isMinimized}
            onBackToList={backToList}
            onToggleMinimize={toggleMinimize}
            onToggleChat={toggleChat}
          />

          {/* 채팅 내용 */}
          {!isMinimized && (
            <>
              {currentView === 'list' ? (
                <ChatRoomList
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filteredChatRooms={filteredChatRooms}
                  onSelectChatRoom={selectChatRoom}
                  onGoToCreateChat={handleGoToCreateChat}
                />
              ) : currentView === 'createChat' ? (
                <EmployeeSearch
                  employeeSearchTerm={employeeSearchTerm}
                  onSearchChange={setEmployeeSearchTerm}
                  filteredEmployees={filteredEmployees}
                  selectedEmployees={selectedEmployees}
                  onToggleEmployee={handleToggleEmployee}
                  onCreateGroupChat={handleCreateGroupChat}
                />
              ) : (
                <ChatRoom
                  selectedChat={selectedChat}
                  message={message}
                  onMessageChange={setMessage}
                  onSendMessage={handleSendMessage}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default FloatingChat
