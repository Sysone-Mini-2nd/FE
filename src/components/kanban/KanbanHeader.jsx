import React from 'react'
import { Add, FilterList, Search, MoreVert } from '@mui/icons-material'

function KanbanHeader() {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">칸반 보드</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 검색 */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="작업 검색..."
              className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          
          {/* 필터 */}
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
            <FilterList className="w-4 h-4" />
            필터
          </button>
          
          {/* 새 카드 추가 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-colors">
            <Add className="w-4 h-4" />
            새 작업
          </button>
          
          {/* 더보기 메뉴 */}
          <button className="p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <MoreVert className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default KanbanHeader
