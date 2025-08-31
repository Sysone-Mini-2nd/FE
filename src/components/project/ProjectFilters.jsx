import React from 'react'
import { FilterList, Sort } from '@mui/icons-material'

function ProjectFilters({ filters, onFiltersChange, sortBy, onSortChange }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    })
  }

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
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="planning">계획 중</option>
            <option value="progress">진행 중</option>
            <option value="completed">완료</option>
            <option value="paused">일시정지</option>
          </select>

          {/* 우선순위 필터 */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 우선순위</option>
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>

          {/* 담당자 필터 */}
          <select
            value={filters.assignee}
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 담당자</option>
            <option value="Kim Manager">Kim Manager</option>
            <option value="Lee Manager">Lee Manager</option>
            <option value="Park Manager">Park Manager</option>
            <option value="Choi Manager">Choi Manager</option>
          </select>

          {/* 기간 필터 */}
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 기간</option>
            <option value="thisWeek">이번 주</option>
            <option value="thisMonth">이번 달</option>
            <option value="thisQuarter">이번 분기</option>
            <option value="overdue">지연됨</option>
          </select>
        </div>

        {/* 정렬 섹션 */}
        <div className="flex items-center gap-4 lg:ml-auto">
          <div className="flex items-center gap-2">
            <Sort className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">정렬:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created">생성일순</option>
            <option value="name">이름순</option>
            <option value="progress">진행률순</option>
            <option value="endDate">마감일순</option>
            <option value="priority">우선순위순</option>
          </select>
        </div>

        {/* 필터 초기화 */}
        {(filters.status !== 'all' || filters.priority !== 'all' || filters.assignee !== 'all' || filters.period !== 'all') && (
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
