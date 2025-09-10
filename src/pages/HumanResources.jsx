import { useState } from 'react';
import { 
  Add, 
  Edit, 
  Delete, 
  Close, 
  Save,
  AccountCircle
} from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import { membersData } from '../data/employees';

function HumanResources() {
  const [members, setMembers] = useState(membersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    account_id: '',
    name: '',
    email: '',
    role: 'USER',
    position: '사원',
    password: ''
  });

  // 테이블 컬럼 정의
  const columns = [
    {
      accessorKey: 'account_id',
      header: '계정 ID',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.account_id}
        </div>
      )
    },
    {
      accessorKey: 'name',
      header: '이름',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AccountCircle className="text-gray-400" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: '이메일',
    },
    {
      accessorKey: 'role',
      header: '권한',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.original.role === 'MASTER' 
            ? 'bg-red-100 text-red-800' 
            : row.original.role === 'MANAGER'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {row.original.role}
        </span>
      )
    },
    {
      accessorKey: 'position',
      header: '직급',
    },
    {
      accessorKey: 'last_login_at',
      header: '마지막 로그인',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {new Date(row.original.last_login_at).toLocaleDateString('ko-KR')}
        </span>
      )
    },
    {
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1 hover:bg-blue-100 rounded-full"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="p-1 text-red-400 hover:bg-red-50 rounded-full"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      account_id: '',
      name: '',
      email: '',
      role: 'USER',
      position: '사원',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      account_id: member.account_id,
      name: member.name,
      email: member.email,
      role: member.role,
      position: member.position,
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMember) {
      // 수정
      setMembers(members.map(member => 
        member.id === editingMember.id 
          ? { 
              ...member, 
              ...formData,
              updated_at: new Date().toISOString()
            }
          : member
      ));
    } else {
      // 추가
      const newMember = {
        id: Math.max(...members.map(m => m.id)) + 1,
        ...formData,
        last_login_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: 0,
        pic_url: null
      };
      setMembers([...members, newMember]);
    }
    
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">인사관리</h1>
        </div>
        <button
          onClick={handleAdd}
          className="createBtn"
        >
          <Add/>
          회원 등록
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable 
          data={members.filter(member => member.is_deleted === 0)}
          columns={columns}
          emptyMessage="등록된 회원이 없습니다."
        />
      </div>

      {/* 회원 등록/수정 모달 */}
      {isModalOpen && (
        <div className="modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingMember ? '회원 정보 수정' : '새 회원 등록'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  계정 ID
                </label>
                <input
                  type="text"
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="createBtn flex-1 justify-center"
                >
                  <Save/>
                  {editingMember ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HumanResources;
