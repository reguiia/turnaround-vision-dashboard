
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export const TopRisks = () => {
  const { data, loading } = useSupabaseData();

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-[500px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-900">Top 5 Risks</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-[240px]">
            <div className="text-center">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const risksData = data['Risks'] || [];
  
  const risks = risksData.slice(0, 5).map((item, index) => ({
    id: index + 1,
    name: item.risk_name,
    probability: item.probability,
    impact: item.impact,
    score: item.risk_score
  }));

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">Top 5 Risks</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="probability" 
                name="Probability" 
                unit="%" 
                domain={[0, 100]}
                label={{ value: 'Probability (%)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="impact" 
                name="Impact" 
                unit="%" 
                domain={[0, 100]}
                label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p>Probability: {data.probability}%</p>
                        <p>Impact: {data.impact}%</p>
                        <p>Risk Score: {data.score}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Risks" data={risks}>
                {risks.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2 max-h-[160px] overflow-y-auto">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Risk Legend</h4>
          {risks.map((risk, index) => (
            <div key={risk.id} className="flex items-center gap-3 text-sm py-1">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="flex-1 text-xs">{risk.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
