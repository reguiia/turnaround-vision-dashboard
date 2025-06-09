
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ActionLogStatusProps {
  data?: any[];
}

export const ActionLogStatus: React.FC<ActionLogStatusProps> = ({ data }) => {
  const defaultData = [
    {
      source: 'DM',
      open: 12,
      closed: 8,
      due: 3,
    },
    {
      source: 'SCM',
      open: 15,
      closed: 22,
      due: 5,
    },
    {
      source: 'TAR2',
      open: 8,
      closed: 15,
      due: 2,
    },
    {
      source: 'TAR3',
      open: 6,
      closed: 4,
      due: 8,
    },
    {
      source: 'RA',
      open: 10,
      closed: 12,
      due: 4,
    },
  ];

  const chartData = data && data.length > 0 ? data.map((item: any) => ({
    source: item.Source,
    open: item.Status === 'Open' ? 1 : 0, // Assuming individual actions, so count 1 if open
    closed: item.Status === 'Closed' ? 1 : 0,
    due: item.Status === 'Due' ? 1 : 0,
  })).reduce((acc, current) => {
    // Aggregate by source
    const existing = acc.find((item: any) => item.source === current.source);
    if (existing) {
      existing.open += current.open;
      existing.closed += current.closed;
      existing.due += current.due;
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []) : defaultData;

  const totalOpen = chartData.reduce((sum: number, item: any) => sum + item.open, 0);
  const totalDue = chartData.reduce((sum: number, item: any) => sum + item.due, 0);
  const totalClosed = chartData.reduce((sum: number, item: any) => sum + item.closed, 0);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Action Log Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" stackId="a" fill="#ef4444" name="Open" />
            <Bar dataKey="due" stackId="a" fill="#f97316" name="Due" />
            <Bar dataKey="closed" stackId="a" fill="#22c55e" name="Closed" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">
              {totalOpen}
            </div>
            <div className="text-sm text-red-700">Total Open</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {totalDue}
            </div>
            <div className="text-sm text-orange-700">Total Due</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {totalClosed}
            </div>
            <div className="text-sm text-green-700">Total Closed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
