import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { 
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'
import { Skeleton } from '@mui/material'

function DataTable({ 
  data = [], 
  columns = [], 
  className = "",
  onRowClick = null,
  emptyMessage = "데이터가 없습니다.",
  loading = false,
  skeletonRows = 5
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // 스켈레톤 로우 생성 함수
  const renderSkeletonRow = (rowIndex, columnCount) => (
    <tr 
      key={`skeleton-${rowIndex}`}
      className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}
    >
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="px-4 py-4">
          <Skeleton 
            variant="text" 
            width={`${Math.floor(Math.random() * 40) + 60}%`}
            height={20}
          />
        </td>
      ))}
    </tr>
  )

  // 스켈레톤 로우들 생성
  const renderSkeletonRows = () => {
    const columnCount = columns.length || 4 // 기본값 4개 컬럼
    return Array.from({ length: skeletonRows }).map((_, index) => 
      renderSkeletonRow(index, columnCount)
    )
  }

  return (
    <div className={`bg-white border-y select-none border-gray-200 overflow-hidden ${className}`}>
      <div>
        <table className="min-w-full">
          <thead className="border-b border-gray-200">
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
                            <ArrowDownward/>
                          ) : (
                            <ArrowUpward/>
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
            {loading ? (
              // 로딩 중일 때 스켈레톤 표시
              renderSkeletonRows()
            ) : table.getRowModel().rows.length === 0 ? (
              // 데이터가 없을 때
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // 실제 데이터 표시
              table.getRowModel().rows.map((row, index) => (
                <tr 
                  key={row.id} 
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 border-b border-gray-100 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
