import React from 'react'

const CalendarFilters = ({ 
  filters, 
  onFilterChange,
  sortBy,
  onSortChange 
}) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange && onFilterChange(filterType, value)
  }

  const handleSortChange = (value) => {
    onSortChange && onSortChange(value)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-5 py-4 bg-white rounded-lg shadow-sm mb-5 gap-4 md:gap-0">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-gray-700 text-sm whitespace-nowrap">분야:</span>
        
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer transition-colors hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[100px] flex-1 md:flex-none md:min-w-[120px]"
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">모든 상태</option>
          <option value="pending">대기 중</option>
          <option value="in-progress">진행 중</option>
          <option value="completed">완료</option>
        </select>

        <select 
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer transition-colors hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[100px] flex-1 md:flex-none md:min-w-[120px]"
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="">모든 우선순위</option>
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </select>

        <select 
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer transition-colors hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[100px] flex-1 md:flex-none md:min-w-[120px]"
          value={filters.assignee || ''}
          onChange={(e) => handleFilterChange('assignee', e.target.value)}
        >
          <option value="">모든 담당자</option>
          <option value="김개발">김개발</option>
          <option value="이디자인">이디자인</option>
          <option value="박기획">박기획</option>
          <option value="최테스터">최테스터</option>
        </select>

        <select 
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer transition-colors hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[100px] flex-1 md:flex-none md:min-w-[120px]"
          value={filters.period || ''}
          onChange={(e) => handleFilterChange('period', e.target.value)}
        >
          <option value="">모든 기간</option>
          <option value="today">오늘</option>
          <option value="week">이번 주</option>
          <option value="month">이번 달</option>
        </select>
      </div>

      <div className="flex items-center gap-3 justify-center md:justify-start w-full md:w-auto">
        <span className="font-medium text-gray-700 text-sm whitespace-nowrap">정렬:</span>
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer transition-colors hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[100px] flex-1 md:flex-none md:min-w-[120px]"
          value={sortBy || 'createdAt'}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="createdAt">생성일순</option>
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
          <option value="title">제목순</option>
        </select>
      </div>
    </div>
  )
}

export default CalendarFilters
