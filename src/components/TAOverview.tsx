
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

export const TAOverview = () => {
  const projectInfo = {
    name: "Major Turnaround 2025",
    location: "Refinery Unit A",
    duration: "45 days",
    startDate: "01/11/2025",
    endDate: "15/12/2025",
    budget: "$12.5M",
    mainDrivers: ["Catalyst Replacement", "Heat Exchanger Maintenance", "Safety Upgrades"],
    status: "Phase 2 - Detailed Planning"
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Turnaround Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Project Details</h3>
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
