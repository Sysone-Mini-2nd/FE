import { Close, Save } from '@mui/icons-material';

function MemberModal({ 
  isOpen, 
  onClose, 
  editingMember, 
  formData, 
  onFormChange, 
  onSubmit,
  isSubmitting = false
}) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingMember ? '회원 정보 수정' : '새 회원 등록'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              계정 ID
            </label>
            <input
              type="text"
              name="accountId"
              value={formData.accountId}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              프로필 이미지 URL
            </label>
            <input
              type="url"
              name="picUrl"
              value={formData.picUrl}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          {!editingMember && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              권한
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">USER</option>
              <option value="MASTER">MASTER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              직급
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="사원">사원</option>
              <option value="주임">주임</option>
              <option value="대리">대리</option>
              <option value="과장">과장</option>
              <option value="부장">부장</option>
              <option value="임원">임원</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="createBtn flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save/>
              {isSubmitting 
                ? (editingMember ? '수정 중...' : '등록 중...') 
                : (editingMember ? '수정' : '등록')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MemberModal;