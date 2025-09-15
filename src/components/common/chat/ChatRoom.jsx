import { useEffect, useRef } from 'react';
import { Send } from '@mui/icons-material';
import useChatStore from '../../../store/chatStore';

const ChatRoom = ({ 
  selectedChat, 
  message, 
  onMessageChange, 
  onSendMessage 
}) => {
  const messagesEndRef = useRef(null);
  
  const { getMessages, connectWebSocket, disconnectWebSocket, markAsRead, currentUser } = useChatStore();
  const messages = [...getMessages(selectedChat?.id || 0)].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // WebSocket 연결 및 구독 관리
  useEffect(() => {
    if (selectedChat?.id && currentUser?.id) {
      connectWebSocket(currentUser.id, selectedChat.id);

      // 채팅방 진입 시 마지막 메시지를 읽음 처리
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.isMine) { // 내가 보낸 메시지가 아닐 경우에만 읽음 처리
        markAsRead(selectedChat.id, lastMessage.id);
      }
    }

    return () => {
      disconnectWebSocket();
    };
  }, [selectedChat?.id, currentUser?.id, connectWebSocket, disconnectWebSocket, markAsRead, messages.length]); // messages.length를 추가하여 메시지 목록이 변경될 때마다 읽음 처리 로직 재실행

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white/50 rounded-b-lg">
      {/* 메시지 영역 */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 min-h-0">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>{selectedChat?.name} 와(과)의 채팅을 시작해보세요!</p>
            </div>
          ) : (
            messages.map((msg) => {
              console.log(`Message ID: ${msg.id}, isMine: ${msg.isMine}, readCount: ${msg.readCount}, type: ${msg.type}`);
              return (
              <div 
                key={msg.id} 
                className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} ${msg.type === 'SYSTEM' ? 'justify-center' : ''}`}>
                <div className={`p-3 rounded-lg shadow-sm max-w-xs ${ 
                  msg.type === 'SYSTEM' 
                    ? 'bg-gray-200 text-gray-700 text-center' // 시스템 메시지 스타일
                    : msg.isMine 
                      ? 'bg-purple-400/50 backdrop-blur-lg text-white' // 내 메시지 스타일 (보라색)
                      : 'bg-white text-gray-800' // 다른 사람 메시지 스타일 (하얀색)
                }`}>
                  {!msg.isMine && msg.type !== 'DELETED' && msg.type !== 'SYSTEM' && (
                    <p className="text-xs text-gray-600 mb-1 font-medium">{msg.senderName}</p>
                  )}
                  {msg.type === 'DELETED' ? (
                    <p className="text-sm italic text-gray-500">삭제된 메시지입니다.</p>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <div className="flex justify-end items-center gap-1 mt-1">
                    <span className={`text-xs ${
                      msg.isMine ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.createdAt)}
                    </span>
                    {msg.isMine && msg.readCount > 0 && msg.type !== 'DELETED' && (
                      <span className="text-xs text-purple-100 font-bold">{msg.readCount}</span>
                    )}
                  </div>
                </div>
              </div>
            )})
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 영역 */}
      <div className="flex-shrink-0">
        <form onSubmit={onSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-3 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;