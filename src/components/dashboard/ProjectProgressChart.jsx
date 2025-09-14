import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectDashboard } from '../../api/dashboardAPI';

function ProjectProgressChart({ selectedProjectId }) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['projectDashboard', selectedProjectId],
    queryFn: () => fetchProjectDashboard(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const projectGraph = dashboardData?.data?.projectGraph;

  // 디버깅을 위한 콘솔 로그
  React.useEffect(() => {
    if (projectGraph) {
      console.log('ProjectGraph 데이터:', projectGraph);
    }
  }, [projectGraph]);

  const pieData = React.useMemo(() => {
    if (!projectGraph) return [];
    
    const data = [];
    
    if (projectGraph.todo > 0 || projectGraph.TODO > 0) {
      data.push({
        name: '할 일',
        value: Number(projectGraph.todo || projectGraph.TODO || 0),
        color: '#6B7280'
      });
    }
    
    if (projectGraph.progress > 0 || projectGraph.IN_PROGRESS > 0) {
      data.push({
        name: '진행중',
        value: Number(projectGraph.progress || projectGraph.IN_PROGRESS || 0),
        color: '#3B82F6'
      });
    }
    
    if (projectGraph.review > 0 || projectGraph.REVIEW > 0) {
      data.push({
        name: '검토',
        value: Number(projectGraph.review || projectGraph.REVIEW || 0),
        color: '#F59E0B'
      });
    }
    

    if (projectGraph.done > 0 || projectGraph.DONE > 0) {
      data.push({
        name: '완료',
        value: Number(projectGraph.done || projectGraph.DONE || 0),
        color: '#10B981'
      });
    }
    
    console.log('Pie 차트 데이터:', data);
    return data;
  }, [projectGraph]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 진행률</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !selectedProjectId) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 진행률</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {!selectedProjectId ? '프로젝트를 선택해주세요' : '데이터를 불러올 수 없습니다'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 진행률</h3>
      
      <div className="h-64">
        {pieData && pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ 
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">데이터가 없습니다</p>
              <p className="text-sm">이슈가 등록되면 차트가 표시됩니다</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 총 이슈 개수 표시 */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          총 {projectGraph?.total || 0}개 이슈
        </span>
      </div>
    </div>
  );
}

export default ProjectProgressChart
