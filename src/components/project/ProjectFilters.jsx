import React from 'react'
import { FilterList, Sort } from '@mui/icons-material'
import Dropdown from '../common/Dropdown'
/** 작성자: 김대호, 백승준 */
function ProjectFilters({ filters, onFiltersChange, sortBy, onSortChange }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    })
  }

  // 드롭다운 옵션들 정의
  const statusOptions = [
    { value: "all", label: "모든 상태" },
    { value: "planning", label: "계획 중" },
    { value: "progress", label: "진행 중" },
    { value: "completed", label: "완료" },
    { value: "paused", label: "일시정지" }
  ];

  const priorityOptions = [
    { value: "all", label: "모든 우선순위" },
    { value: "high", label: "높음" },
    { value: "medium", label: "보통" },
    { value: "low", label: "낮음" }
  ];

  const sortOptions = [
    { value: "CREATED_AT", label: "생성일순" },
    { value: "NAME", label: "이름순" },
    { value: "END_DATE", label: "마감일순" },
    { value: "PRIORITY", label: "우선순위순" }
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* 필터 섹션 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FilterList className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">필터:</span>
          </div>

          {/* 상태 필터 */}
          <Dropdown
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            width="w-32"
          />

          {/* 우선순위 필터 */}
          <Dropdown
            options={priorityOptions}
            value={filters.priority}
            onChange={(value) => handleFilterChange('priority', value)}
            width="w-36"
          />

        </div>

        {/* 정렬 섹션 */}
        <div className="flex items-center gap-4 lg:ml-auto">
          <div className="flex items-center gap-2">
            <Sort className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">정렬:</span>
          </div>
          <Dropdown
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            width="w-32"
          />
        </div>

        {/* 필터 초기화 */}
        {(filters.status !== 'all' || filters.priority !== 'all') && (
          <button
            onClick={() => onFiltersChange({
              status: 'all',
              priority: 'all',
              assignee: 'all',
              period: 'all'
            })}
            className="text-sm text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
          >
            필터 초기화
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectFilters
