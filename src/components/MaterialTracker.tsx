
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const MaterialTracker = () => {
  const taStartDate = new Date('2025-11-01');
  const currentDate = new Date();
  
  const materials = [
    { name: 'Heat Exchanger Tubes', processStart: '2025-02-10', leadTime: 180, status: 'on-track' },
    { name: 'Catalyst Material', processStart: '2025-01-15', leadTime: 200, status: 'delayed' },
    { name: 'Valve Assemblies', processStart: '2025-03-01', leadTime: 150, status: 'on-track' },
    { name: 'Gaskets & Seals', processStart: '2025-04-01', leadTime: 120, status: 'ahead' },
    { name: 'Pipe Fittings', processStart: '2025-02-15', leadTime: 160, status: 'on-track' },
    { name: 'Insulation Material', processStart: '2025-03-15', leadTime: 140, status: 'on-track' },
    { name: 'Safety Equipment', processStart: '2025-01-20', leadTime: 190, status: 'delayed' },
    { name: 'Electrical Components', processStart: '2025-02-20', leadTime: 170, status: 'on-track' },
    { name: 'Control Systems', processStart: '2025-01-10', leadTime: 210, status: 'ahead' },
    { name: 'Structural Steel', processStart: '2025-03-10', leadTime: 130, status: 'on-track' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      ahead: "default",
      'on-track': "secondary", 
      delayed: "destructive"
    };
    return variants[status] || "outline";
  };

  const calculateProgress = (processStart: string, leadTime: number) => {
    const startDate = new Date(processStart);
    const endDate = new Date(startDate.getTime() + leadTime * 24 * 60 * 60 * 1000);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = currentDate.getTime() - startDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Material Sourcing Tracker</CardTitle>
        <p className="text-sm text-gray-600">TA Start: 01/11/2025</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {materials.map((material, index) => {
            const progress = calculateProgress(material.processStart, material.leadTime);
            const processStartDate = new Date(material.processStart);
            const completionDate = new Date(processStartDate.getTime() + material.leadTime * 24 * 60 * 60 * 1000);
            const isBeforeTAStart = completionDate < taStartDate;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{material.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(material.status)}>
                      {material.status}
                    </Badge>
                    {isBeforeTAStart ? (
                      <Badge className="bg-green-100 text-green-800">✓ Ready</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">⚠ Risk</Badge>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <Progress value={progress} className="h-6" />
                  <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
                    <span>{material.processStart}</span>
                    <span>{completionDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Lead Time: {material.leadTime} days</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                
                {/* TA Start Reference Line */}
                <div className="relative h-1 bg-gray-200 rounded">
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-orange-500"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((taStartDate.getTime() - processStartDate.getTime()) / (material.leadTime * 24 * 60 * 60 * 1000)) * 100))}%`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
