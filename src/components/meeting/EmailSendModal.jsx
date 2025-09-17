// src/components/meeting/EmailSendModal.jsx (새 파일 생성)
import { useState } from 'react';
import { Close, AttachFile, Send } from '@mui/icons-material';
import { sendMeetingEmail } from '../../api/meetingAPI';
import { useToast } from '../../hooks/useToast';
/** 작성자: 배지원 */
function EmailSendModal({ isOpen, onClose, projectId, meetingId, meetingTitle }) {
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    to: '',
    subject: `회의록: ${meetingTitle || '제목 없음'}`,
    content: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // src/components/meeting/EmailSendModal.jsx의 handleSubmit 함수 수정
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.to.trim()) {
    showError('수신자 이메일 주소를 입력해주세요.');
    return;
  }
  
  if (!formData.subject.trim()) {
    showError('이메일 제목을 입력해주세요.');
    return;
  }
  
  if (!formData.content.trim()) {
    showError('이메일 내용을 입력해주세요.');
    return;
  }

  // 이메일 주소 유효성 검사 개선
  const toEmails = formData.to.split(',').map(email => email.trim()).filter(email => email);
  
  // 각 이메일 주소 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = toEmails.filter(email => !emailRegex.test(email));
  
  if (invalidEmails.length > 0) {
    showError(`유효하지 않은 이메일 주소가 있습니다: ${invalidEmails.join(', ')}`);
    return;
  }

  setIsSending(true);
  try {
    await sendMeetingEmail(projectId, meetingId, {
      to: toEmails,
      subject: formData.subject,
      content: formData.content
    }, attachments);
    
    showSuccess('이메일이 성공적으로 전송되었습니다.');
    onClose();
    
    // 폼 초기화
    setFormData({
      to: '',
      subject: `회의록: ${meetingTitle || '제목 없음'}`,
      content: ''
    });
    setAttachments([]);
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    if (error.response?.status === 400) {
      showError('잘못된 요청입니다. 입력 정보를 확인해주세요.');
    } else if (error.response?.status === 500) {
      showError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      showError('이메일 전송 중 오류가 발생했습니다.');
    }
  } finally {
    setIsSending(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">이메일 전송</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 수신자 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수신자 이메일 주소 *
            </label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="example@email.com, example2@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              multiple // 여러 이메일 주소 입력을 위해 추가
              noValidate // 브라우저 기본 유효성 검사 비활성화
            />
            <p className="text-xs text-gray-500 mt-1">
              여러 이메일 주소는 쉼표(,)로 구분해주세요.
            </p>
          </div>

          {/* 이메일 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 제목 *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 이메일 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 내용 *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              placeholder="이메일 내용을 입력해주세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 첨부파일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              첨부파일
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <AttachFile />
                파일 선택
              </label>
            </div>
            
            {/* 선택된 파일 목록 */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSending}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isSending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Send />
              {isSending ? '전송 중...' : '전송'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailSendModal;