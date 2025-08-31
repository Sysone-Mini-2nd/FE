import React from 'react'
import { Add, Search, ViewModule, ViewList, TableChart } from '@mui/icons-material'

function ProjectHeader({ 
  onCreateProject, 
  searchTerm, 
  onSearchChange, 
  viewType, 
  onViewTypeChange 
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* 페이지 제목 및 생성 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">프로젝트 관리</h1>
          <p className="text-gray-600 mt-1">팀의 모든 프로젝트를 관리하고 추적하세요</p>
        </div>
        <button
          onClick={onCreateProject}
          className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-600 flex items-center gap-2 transition-colors"
        >
          <Add className="w-5 h-5" />
          새 프로젝트
        </button>
      </div>

      {/* 검색 및 뷰 컨트롤 */}
      <div className="flex items-center gap-4">
        {/* 검색 */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>

        {/* 뷰 타입 선택 */}
        <div className="flex border border-gray-300">
          <button
            onClick={() => onViewTypeChange('card')}
            className={`p-2 transition-colors ${
              viewType === 'card' 
                ? 'bg-gray-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="카드"
          >
            <ViewModule className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewTypeChange('list')}
            className={`p-2 transition-colors border-l border-r border-gray-300 ${
              viewType === 'list' 
                ? 'bg-gray-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="리스트"
          >
            <ViewList className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewTypeChange('table')}
            className={`p-2 transition-colors ${
              viewType === 'table' 
                ? 'bg-gray-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="테이블"
          >
            <TableChart className="w-4 h-4" />
          </button>
        </div>

        {/* 생성 버튼 (데스크톱) */}
        <button
          onClick={onCreateProject}
          className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-600 items-center gap-2 transition-colors"
        >
          <Add className="w-5 h-5" />
          새 프로젝트
        </button>
      </div>
    </div>
  )
}

export default ProjectHeader
