import React from 'react'
import { Folder, PlayArrow, CheckCircle, Schedule, Warning } from '@mui/icons-material'

function ProjectStats({ projects }) {
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    overdue: projects.filter(p => {
      const endDate = new Date(p.endDate)
      const today = new Date()
      return p.status === 'progress' && endDate < today
    }).length
  }

  const statCards = [
    {
      title: '전체',
      value: stats.total,
      color: 'text-blue-600'
    },
    {
      title: '진행중',
      value: stats.inProgress,
      color: 'text-green-600'
    },
    {
      title: '완료',
      value: stats.completed,
      color: 'text-gray-600'
    },
    {
      title: '계획중',
      value: stats.planning,
      color: 'text-yellow-600'
    },
    {
      title: '지연',
      value: stats.overdue,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 p-4 hover:border-gray-300 transition-colors"
        >
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectStats
