
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export const BookiesBoard = () => {
  const { data, loading } = useSupabaseData();

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-[500px]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Bookies Board Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const bookiesData = data['Bookies Data'] || [];
  
  const chartData = bookiesData.map(item => ({
    area: item.area,
    target: item.target,
    measured: item.actual
  }));

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-[500px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Bookies Board Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartData}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis 
              dataKey="area" 
              tick={{ fontSize: 12 }}
              className="text-gray-700"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={3}
            />
            <Radar
              name="Measured"
              dataKey="measured"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
              strokeWidth={3}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Target Values</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Measured Values</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
