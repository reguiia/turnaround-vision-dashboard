
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export const TAOverview = () => {
  const { data, loading } = useSupabaseData();
  
  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Turnaround Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const generalInfo = data['General Info'] || [];
  
  const getInfoValue = (field: string) => {
    const item = generalInfo.find(item => item.field === field);
    return item?.value || 'N/A';
  };

  const projectInfo = {
    name: getInfoValue('TA Name'),
    location: getInfoValue('Location'),
    duration: getInfoValue('Duration'),
    startDate: getInfoValue('Start Date'),
    endDate: getInfoValue('End Date'),
    budget: getInfoValue('Budget'),
    mainDrivers: getInfoValue('Main Drivers').split(', '),
    status: getInfoValue('Status')
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Turnaround Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Turnaround Details</h3>
            <p className="text-lg font-bold">{projectInfo.name}</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              {projectInfo.location}
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {projectInfo.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Timeline</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{projectInfo.startDate} - {projectInfo.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{projectInfo.duration}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Budget</h3>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xl font-bold">{projectInfo.budget}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Main Drivers</h3>
            <div className="space-y-1">
              {projectInfo.mainDrivers.map((driver, index) => (
                <div key={index} className="text-sm bg-white/10 px-2 py-1 rounded">
                  {driver}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
