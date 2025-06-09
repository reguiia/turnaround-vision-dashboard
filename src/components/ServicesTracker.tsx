
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ServicesTrackerProps {
  data?: any[];
}

export const ServicesTracker: React.FC<ServicesTrackerProps> = ({ data }) => {
  const taStartDate = new Date('2025-11-01');
  const currentDate = new Date();
  
  const defaultServices = [
    { name: 'Crane Services', processStart: '2025-03-01', leadTime: 120, status: 'on-track' },
    { name: 'Scaffolding Contractors', processStart: '2025-02-15', leadTime: 140, status: 'ahead' },
    { name: 'Welding Specialists', processStart: '2025-01-20', leadTime: 180, status: 'delayed' },
    { name: 'NDT Services', processStart: '2025-03-10', leadTime: 110, status: 'on-track' },
    { name: 'Transportation Services', processStart: '2025-04-01', leadTime: 100, status: 'on-track' },
    { name: 'Environmental Services', processStart: '2025-02-20', leadTime: 130, status: 'ahead' },
    { name: 'Security Services', processStart: '2025-05-01', leadTime: 90, status: 'on-track' },
    { name: 'Catering Services', processStart: '2025-06-01', leadTime: 80, status: 'on-track' },
    { name: 'Medical Services', processStart: '2025-04-15', leadTime: 95, status: 'ahead' },
    { name: 'IT Support Services', processStart: '2025-03-20', leadTime: 105, status: 'delayed' }
  ];

  const services = data && data.length > 0 ? data.map((item: any) => ({
    name: item.Service_Name,
    processStart: item.Initiation_Date, // Assuming format 'DD/MM/YYYY'
    leadTime: item.Lead_Time_Days,
    status: item.Status.toLowerCase().replace(' ', '-'), // 'on-track', 'at-risk' -> 'delayed', 'complete' -> 'ahead'
  })) : defaultServices;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'at-risk': return 'bg-orange-500'; // Added for 'At Risk' status from Excel
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      ahead: "default",
      'on-track': "secondary", 
      delayed: "destructive",
      'at-risk': "destructive" // Map 'at-risk' to destructive
    };
    return variants[status] || "outline";
  };

  const parseDateString = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const calculateProgress = (processStart: string, leadTime: number) => {
    const startDate = parseDateString(processStart);
    const endDate = new Date(startDate.getTime() + leadTime * 24 * 60 * 60 * 1000);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = currentDate.getTime() - startDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Services Procurement Tracker</CardTitle>
        <p className="text-sm text-gray-600">TA Start: {taStartDate.toLocaleDateString()}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => {
            const progress = calculateProgress(service.processStart, service.leadTime);
            const processStartDate = parseDateString(service.processStart);
            const completionDate = new Date(processStartDate.getTime() + service.leadTime * 24 * 60 * 60 * 1000);
            const isBeforeTAStart = completionDate < taStartDate;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(service.status)}>
                      {service.status}
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
                    <span>{service.processStart}</span>
                    <span>{completionDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Lead Time: {service.leadTime} days</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                
                {/* TA Start Reference Line */}
                <div className="relative h-1 bg-gray-200 rounded">
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-orange-500"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((taStartDate.getTime() - processStartDate.getTime()) / (service.leadTime * 24 * 60 * 60 * 1000)) * 100))}%`
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
