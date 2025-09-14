import React from 'react';

// 1. props로 projects 배열 대신, 이미 계산된 total, stats, delayed 값을 받습니다.
function ProjectStats({ total = 0, stats = {}, delayed = 0 }) {

  // 2. 프론트엔드에서 직접 계산하던 복잡한 로직을 모두 제거합니다.

  // 3. props로 받은 데이터를 사용하여 statCards 배열을 직접 생성합니다.
  const statCards = [
    {
      title: '전체',
      value: total, // total prop 사용
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
      value: delayed, // delayed prop 사용
      color: 'text-red-600'
    }
  ];

  // 4. 렌더링 부분은 그대로 유지합니다.
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
