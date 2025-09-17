import { Add } from '@mui/icons-material';
/** 작성자: 김대호 */
function MemberHeader({ onCreateMember }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">인사관리</h1>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCreateMember}
          className="createBtn"
        >
          <Add/>
          회원 등록
        </button>
      </div>
    </div>
  );
}

export default MemberHeader;