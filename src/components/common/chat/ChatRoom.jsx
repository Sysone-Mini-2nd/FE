import { useEffect, useRef, useState } from 'react';
import { Send } from '@mui/icons-material';
import useChatStore from '../../../store/chatStore';
import { sendInviteMessage } from '../../../api/socketService';
import { useDebounce } from '../../../hooks/useDebounce';
import * as chatApi from '../../../api/chatApi';

const ChatRoom = ({
  selectedChat,
  message,
  onMessageChange,
  onSendMessage
}) => {
  const messagesEndRef = useRef(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState('');
  const debouncedSearchTerm = useDebounce(employeeSearchTerm, 500);

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
      if (lastMessage && lastMessage.senderId !== currentUser.id) { // 내가 보낸 메시지가 아닐 경우
        markAsRead(selectedChat.id, lastMessage.id);
      }
    }

    return () => {
      disconnectWebSocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?.id, currentUser?.id, connectWebSocket, disconnectWebSocket, markAsRead, messages.length]);

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

  const handleToggleEmployee = (employee) => {
    setSelectedEmployees((prev) =>
      prev.some((e) => e.id === employee.id)
        ? prev.filter((e) => e.id !== employee.id)
        : [...prev, employee]
    );
  };

  const handleInviteMembers = async () => {
    if (selectedEmployees.length === 0) {
      alert('초대할 사원을 선택하세요.');
      return;
    }

    try {
      sendInviteMessage(
        selectedChat.id,
        currentUser.id,
        selectedEmployees.map((e) => e.id)
      );
      setInviteSuccessMessage('초대가 완료되었습니다.');
      setTimeout(() => setInviteSuccessMessage(''), 3000); // 3초 후 메시지 제거
      setInviteModalOpen(false);
    } catch (error) {
      console.error('Failed to invite members:', error);
      alert('초대에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = debouncedSearchTerm
          ? await chatApi.searchMembers(debouncedSearchTerm)
          : await chatApi.fetchAllMembers();
        setAllEmployees(response.data.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, [debouncedSearchTerm]);

  // 메시지 렌더링 컴포넌트 분리
  const Message = ({ msg, isMine, formatTime }) => (
    <div
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${msg.type === 'SYSTEM' ? 'justify-center' : ''}`}
    >
      <div
        className={`p-3 rounded-lg shadow-sm max-w-xs ${
          msg.type === 'SYSTEM'
            ? 'bg-gray-200 text-gray-700 text-center'
            : isMine
            ? 'bg-emerald-400/50 backdrop-blur-lg text-white'
            : 'bg-white text-gray-800'
        }`}
      >
        {!isMine && msg.type !== 'DELETED' && msg.type !== 'SYSTEM' && (
          <p className="text-xs text-gray-600 mb-1 font-medium">{msg.senderName}</p>
        )}
        {msg.type === 'DELETED' ? (
          <p className="text-sm italic text-gray-500">삭제된 메시지입니다.</p>
        ) : (
          <p className="text-sm">{msg.content}</p>
        )}
        <div className="flex justify-end items-center gap-1 mt-1">
          <span
            className={`text-xs ${
              msg.type === 'SYSTEM' ? 'text-black' : isMine ? 'text-emerald-100' : 'text-gray-500'
            }`}
          >
            {formatTime(msg.createdAt)}
          </span>
          {isMine && msg.readCount > 0 && msg.type !== 'DELETED' && msg.type !== 'SYSTEM' && (
            <span className="text-xs text-emerald-100 font-bold">{msg.readCount}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white/50 rounded-b-lg">
      {inviteSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-emerald-400 text-white px-6 py-3 rounded-lg shadow-lg text-lg">
            {inviteSuccessMessage}
          </div>
        </div>
      )}
      {/* 메시지 영역 */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 min-h-0">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>{selectedChat?.name} 와(과)의 채팅을 시작해보세요!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return <Message key={msg.id} msg={msg} isMine={isMine} formatTime={formatTime} />;
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 영역 */}
      <div className="flex-shrink-0">
        <form onSubmit={onSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-2">
            {/* 초대 아이콘 */}
            <button
              onClick={() => setInviteModalOpen(true)}
              className="p-2 bg-emerald-400 text-white rounded-full shadow-lg hover:bg-emerald-500 transition-colors"
              title="초대하기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
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

      {/* 초대 모달 */}
      {inviteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">사원 초대</h3>
            <input
              type="text"
              value={employeeSearchTerm}
              onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              placeholder="사원을 검색하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm mb-4"
            />
            <ul className="max-h-60 overflow-y-auto mb-4">
              {allEmployees.map((employee) => (
                <li key={employee.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.some((e) => e.id === employee.id)}
                    onChange={() => handleToggleEmployee(employee)}
                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-800">{employee.name}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleInviteMembers}
                className="px-4 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors"
              >
                초대하기
              </button>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ChatRoom;