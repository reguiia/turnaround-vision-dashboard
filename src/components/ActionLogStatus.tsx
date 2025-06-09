
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const ActionLogStatus = () => {
  const data = [
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

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Action Log Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              {data.reduce((sum, item) => sum + item.open, 0)}
            </div>
            <div className="text-sm text-red-700">Total Open</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {data.reduce((sum, item) => sum + item.due, 0)}
            </div>
            <div className="text-sm text-orange-700">Total Due</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.closed, 0)}
            </div>
            <div className="text-sm text-green-700">Total Closed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
