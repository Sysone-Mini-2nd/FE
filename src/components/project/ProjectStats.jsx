import React from 'react';
/** 작성자: 김대호, 백승준 */
function ProjectStats({ total = 0, stats = {}, delayed = 0 }) {

  const statCards = [
    {
      title: '전체',
      value: total || 0, // total prop 사용
      color: 'text-blue-600'
    },
    {
      title: '진행중',
      value: stats.IN_PROGRESS || 0, // stats 객체의 IN_PROGRESS 키 사용
      color: 'text-green-600'
    },
    {
      title: '완료',
      value: stats.DONE || 0, // stats 객체의 DONE 키 사용
      color: 'text-gray-600'
    },
    {
      title: '계획중',
      value: stats.TODO || 0, // stats 객체의 TODO 키 사용
      color: 'text-yellow-600'
    },
    {
      title: '지연',
      value: delayed || 0, // delayed prop 사용
      color: 'text-red-600'
    }
  ];

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
  );
}

export default ProjectStats;
