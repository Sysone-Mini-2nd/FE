import { Edit, Delete, AccountCircle } from '@mui/icons-material';
import DataTable from '../common/DataTable';

function MemberTable({ members, onEdit, onDelete }) {
  // 테이블 컬럼 정의
  const columns = [
    {
      accessorKey: 'accountId',
      header: '계정 ID',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.accountId}
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
      accessorKey: 'lastLoginAt',
      header: '마지막 로그인',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.lastLoginAt ? new Date(row.original.lastLoginAt).toLocaleDateString('ko-KR') : '-'}
        </span>
      )
    },
    {
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="p-1 hover:bg-blue-100 rounded-full"
          >
            <Edit />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1 text-red-400 hover:bg-red-50 rounded-full"
          >
            <Delete />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <DataTable 
        data={members}
        columns={columns}
        emptyMessage="등록된 회원이 없습니다."
        skeletonRows={10}
      />
    </div>
  );
}

export default MemberTable;