import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts';
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
    if (dashboardData) {
      console.log('전체 대시보드 데이터:', dashboardData);
      console.log('projectGraph 데이터:', projectGraph);
    }
  }, [dashboardData, projectGraph]);

  const pieData = React.useMemo(() => {
    if (!projectGraph) return [];
    
    const data = [];
    
    // 각 상태별 데이터 처리 (대소문자 구분 없이)
    const todo = projectGraph.todo || projectGraph.TODO || 0;
    const progress = projectGraph.progress || projectGraph.IN_PROGRESS || projectGraph.inProgress || 0;
    const review = projectGraph.review || projectGraph.REVIEW || 0;
    const done = projectGraph.done || projectGraph.DONE || 0;
    
    if (todo > 0) {
      data.push({
        name: '계획',
        value: Number(todo),
        color: '#6B7280'
      });
    }
    
    if (progress > 0) {
      data.push({
        name: '진행중',
        value: Number(progress),
        color: '#3B82F6'
      });
    }
    
    if (review > 0) {
      data.push({
        name: '리뷰중',
        value: Number(review),
        color: '#F59E0B'
      });
    }

    if (done > 0) {
      data.push({
        name: '완료',
        value: Number(done),
        color: '#10B981'
      });
    }
    
    console.log('Pie 차트 데이터:', data);
    return data;
  }, [projectGraph]);

  // 완료율 계산 - 더 안전한 방식
  const completionRate = React.useMemo(() => {
    if (!projectGraph) return 0;
    
    // 총 개수 계산
    const total = Number(projectGraph.total || 0);
    const completed = Number(projectGraph.done || projectGraph.DONE || 0);
    
    console.log('완료율 계산:', { total, completed });
    
    if (total === 0) return 0;
    
    const rate = completed;
    console.log('계산된 완료율:', rate);
    return rate;
  }, [projectGraph]);

  // 각 항목별 퍼센트 계산
  const itemPercentages = React.useMemo(() => {
    if (!projectGraph) return [];
    
    const total = Number(projectGraph.total || 0);
    if (total === 0) return [];

    return pieData.map(item => {
      const percentage = item.value ;
      console.log(`${item.name} 퍼센트:`, { value: item.value, total, percentage });
      return {
        ...item,
        percentage
      };
    });
  }, [pieData, projectGraph]);

  // 중앙 라벨 컴포넌트
  const renderCustomLabel = () => {
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="text-3xl font-bold fill-gray-900"
      >
        {completionRate}%
      </text>
    );
  };

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
      
      <div className="h-64 relative">
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
                <Label content={renderCustomLabel} />
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}개`, name]}
                contentStyle={{ 
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
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
      
      {/* 각 항목별 퍼센트 표시 */}
      {itemPercentages.length > 0 && (
        <div className="mt-4 space-y-2">
          {itemPercentages.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* 총 이슈 개수 표시 */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          총 {projectGraph?.total || 0}개 이슈
        </span>
      </div>
    </div>
  );
}

export default ProjectProgressChart;