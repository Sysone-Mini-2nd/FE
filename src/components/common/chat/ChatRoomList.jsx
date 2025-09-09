import React from 'react'
import { Search, Add, Group } from '@mui/icons-material'

const ChatRoomList = ({ 
  searchTerm, 
  onSearchChange, 
  filteredChatRooms, 
  onSelectChatRoom, 
  onGoToCreateChat 
}) => {
  return (
    <div className="h-[540px] flex flex-col bg-white/50">
      {/* 검색 및 채팅방 생성 */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="사람, 채팅방..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
          <button
            onClick={onGoToCreateChat}
            className="bg-emerald-400 text-white p-1.5 rounded-full transition-colors"
          >
            <Add/>
          </button>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onSelectChatRoom(room)}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center mr-3 text-white font-medium">
              {room.type === 'group' ? (
                <Group/>
              ) : (
                room.name.substring(0, 1)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800 truncate">{room.name}</h4>
                <span className="text-xs text-gray-500">{room.lastTime}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
            </div>
            {room.unreadCount > 0 && (
              <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ml-2">
                {room.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatRoomList
