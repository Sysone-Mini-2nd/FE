import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreVert } from '@mui/icons-material';
import DataTable from '../common/DataTable';

const columnHelper = createColumnHelper();

function ProjectTable({ projects, onAction }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'IN_PROGRESS': { label: '진행중', className: 'bg-green-100 text-green-800 border-green-200' },
      'DONE': { label: '완료', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'PAUSED': { label: '일시정지', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'TODO': { label: '계획중', className: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
    const config = statusConfig[status] || statusConfig['TODO']
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'HIGH': { label: '높음', className: 'bg-red-100 text-red-800 border-red-200' },
      'NORMAL': { label: '보통', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'LOW': { label: '낮음', className: 'bg-green-100 text-green-800 border-green-200' }
    }
    const config = priorityConfig[priority] || priorityConfig['NORMAL']
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const columns = [
    columnHelper.accessor('name', {
      header: '프로젝트',
      cell: info => (
        <div className="flex items-center gap-3">
          <div>
            <div 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onAction('view', info.row.original)}
            >
              {info.getValue()}
            </div>
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {info.row.original.desc}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: '상태',
      cell: info => getStatusBadge(info.getValue()),
    }),
    columnHelper.accessor('priority', {
      header: '우선순위',
      cell: info => getPriorityBadge(info.getValue()),
    }),
    columnHelper.accessor('progressRate', {
      header: '진행률',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 h-2 rounded-full min-w-[60px]">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                info.getValue() >= 80 ? 'bg-green-600' : 
                info.getValue() >= 50 ? 'bg-blue-600' : 'bg-gray-400'
              }`}
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className="text-sm text-gray-700 min-w-[35px]">
            {info.getValue()}%
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('pmName', {
      header: '담당자',
      cell: info => <span className="text-sm">{info.getValue()}</span>,
    }),

    // 1. "시작일" 컬럼을 추가합니다.
    columnHelper.accessor('startDate', {
      header: '시작일',
      // 2. toLocaleDateString()을 사용하여 날짜 형식만 표시합니다.
      cell: info => <span className="text-sm">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),

    columnHelper.accessor('endDate', {
      header: '마감일',
      cell: info => {
        const endDate = new Date(info.getValue())
        const isOverdue = endDate < new Date() && info.row.original.status === 'IN_PROGRESS'
        const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
        
        return (
          <div>
            {/* 2. toLocaleDateString()을 사용하여 날짜 형식만 표시합니다. */}
            <div className="text-sm">
              {endDate.toLocaleDateString()}
            </div>
            {isOverdue && (
              <div className="text-xs text-red-600 font-medium">
                {Math.abs(daysRemaining)}일 지연
              </div>
            )}
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'tasks',
      header: '작업',
      cell: info => (
        <span className="text-sm text-gray-600">
          {info.row.original.completedTasks}/{info.row.original.totalTasks}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: info => (
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVert className="w-4 h-4 text-gray-500" />
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 shadow-sm py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('edit', info.row.original);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              편집
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('delete', info.row.original);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      ),
    }),
  ]

  return (
    <DataTable 
      data={projects}
      columns={columns}
      onRowClick={(project) => onAction('view', project)}
      emptyMessage="프로젝트가 없습니다."
    />
  )
}

export default ProjectTable;
