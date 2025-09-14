import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectDashboard } from '../../api/dashboardAPI';

function TeamProductivityTrend({ selectedProjectId }) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  // Bar 차트용 데이터 변환
  const barData = React.useMemo(() => {
    const issuesGraph = dashboardData?.data?.issuesGraph || [];
    if (!issuesGraph || issuesGraph.length === 0) return [];
    
    return issuesGraph.map(item => ({
      name: item.name || 'Unknown',
      '할당 기간': item.allottedPeriod || 0,
      '완료 기간': item.completedPeriod || 0,
      nameColor: (item.completedPeriod || 0) > (item.allottedPeriod || 0) ? '#EF4444' : '#10B981' // 지연시 빨강, 정상시 초록
    }));
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인원별 이슈 진행률</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !selectedProjectId) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인원별 이슈 진행률</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {!selectedProjectId ? '프로젝트를 선택해주세요' : '데이터를 불러올 수 없습니다'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">인원별 이슈 진행률</h3>
      
      <div className="h-64">
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                label={{ value: '일수', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value}일`,
                  name
                ]}
              />
              <Legend />
              <Bar 
                dataKey="할당 기간" 
                fill="#93C5FD" 
                name="할당 기간"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="완료 기간" 
                fill="#3B82F6" 
                name="완료 기간"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">데이터가 없습니다</p>
              <p className="text-sm">이슈가 할당되면 차트가 표시됩니다</p>
            </div>
          </div>
        )}
      </div>

      {/* 범례 및 상태 정보 */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded mr-2"></div>
              <span className="text-gray-600">할당 기간</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-gray-600">완료 기간</span>
            </div>
          </div>
        </div>
        
        {/* 지연 알림 */}
        {barData.some(item => item['완료 기간'] > item['할당 기간']) && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ⚠️ 일부 작업이 예정 기간을 초과했습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamProductivityTrend
