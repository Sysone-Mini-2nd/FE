import { Search } from '@mui/icons-material'

const EmployeeSearch = ({ 
  employeeSearchTerm, 
  onSearchChange, 
  filteredEmployees, 
  selectedEmployees, 
  onToggleEmployee, 
  onCreateGroupChat 
}) => {
  return (
    <div className="flex flex-col h-full bg-white/50 rounded-b-lg">
      {/* 검색 입력 */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="사원 이름, 부서로 검색..."
            value={employeeSearchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          />
        </div>
      </div>

      {/* 사원 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            <input
              type="checkbox"
              checked={selectedEmployees.find(emp => emp.id === employee.id) !== undefined}
              onChange={() => onToggleEmployee(employee)}
              className="mr-3 w-4 h-4 text-emerald-600 bg-gray-100"
            />
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center mr-3 text-white font-medium">
              {employee.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800">{employee.name}</h4>
              <p className="text-sm text-gray-600">{employee.department} · {employee.position}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 사원들과 채팅방 만들기 버튼 */}
      {selectedEmployees.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              선택된 사원 ({selectedEmployees.length}명)
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedEmployees.map((employee) => (
                <span
                  key={employee.id}
                  className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs"
                >
                  {employee.name}
                  <button
                    onClick={() => onToggleEmployee(employee)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onCreateGroupChat}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {selectedEmployees.length === 1 ? '개인 채팅 시작' : `그룹 채팅 만들기 (${selectedEmployees.length}명)`}
          </button>
        </div>
      )}
    </div>
  )
}

export default EmployeeSearch
