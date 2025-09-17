import { useState } from 'react'
import { employeesData } from '../../data/employees'
/** 작성자: 김대호 */
export const useEmployees = () => {
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState([])

  const handleToggleEmployee = (employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.find(emp => emp.id === employee.id)
      if (isSelected) {
        return prev.filter(emp => emp.id !== employee.id)
      } else {
        return [...prev, employee]
      }
    })
  }

  const clearSelectedEmployees = () => {
    setSelectedEmployees([])
    setEmployeeSearchTerm('')
  }

  const filteredEmployees = employeesData.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  )

  return {
    employees: employeesData,
    employeeSearchTerm,
    setEmployeeSearchTerm,
    selectedEmployees,
    setSelectedEmployees,
    handleToggleEmployee,
    clearSelectedEmployees,
    filteredEmployees
  }
}
