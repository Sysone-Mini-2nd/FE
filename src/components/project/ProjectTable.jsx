import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { 
  Star, 
  StarBorder, 
  MoreVert,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'

const columnHelper = createColumnHelper()

function ProjectTable({ projects, onAction }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'progress': { label: '진행중', className: 'bg-green-100 text-green-800 border-green-200' },
      'completed': { label: '완료', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'paused': { label: '일시정지', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'planning': { label: '계획중', className: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
    const config = statusConfig[status] || statusConfig['planning']
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { label: '높음', className: 'bg-red-100 text-red-800 border-red-200' },
      'medium': { label: '보통', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'low': { label: '낮음', className: 'bg-green-100 text-green-800 border-green-200' }
    }
    const config = priorityConfig[priority] || priorityConfig['medium']
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
          <button
            onClick={() => onAction('star', info.row.original)}
            className="text-gray-400 hover:text-yellow-600 transition-colors"
          >
            {info.row.original.isStarred ? 
              <Star className="w-4 h-4 text-yellow-600" /> : 
              <StarBorder className="w-4 h-4" />
            }
          </button>
          <div>
            <div 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onAction('view', info.row.original)}
            >
              {info.getValue()}
            </div>
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {info.row.original.description}
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
    columnHelper.accessor('progress', {
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
    columnHelper.accessor('manager', {
      header: '담당자',
      cell: info => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('team', {
      header: '팀원',
      cell: info => (
        <div className="flex items-center gap-1">
          <span className="text-sm">{info.getValue().length}명</span>
          <div className="flex -space-x-1">
            {info.getValue().slice(0, 3).map((member, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border border-white"
                title={member}
              >
                {member.slice(0, 1)}
              </div>
            ))}
            {info.getValue().length > 3 && (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 border border-white">
                +{info.getValue().length - 3}
              </div>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: '마감일',
      cell: info => {
        const endDate = new Date(info.getValue())
        const isOverdue = endDate < new Date() && info.row.original.status === 'progress'
        const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
        
        return (
          <div>
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
              onClick={() => onAction('view', info.row.original)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              보기
            </button>
            <button
              onClick={() => onAction('edit', info.row.original)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              편집
            </button>
            <button
              onClick={() => onAction('clone', info.row.original)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              복제
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={() => onAction('delete', info.row.original)}
              className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted() && (
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ArrowDownward className="w-3 h-3" />
                          ) : (
                            <ArrowUpward className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table.getRowModel().rows.map((row, index) => (
              <tr 
                key={row.id} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 border-b border-gray-100`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProjectTable
