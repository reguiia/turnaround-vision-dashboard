
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

interface TAOverviewProps {
  data?: any[]; // Expect data as an array of objects
}

export const TAOverview: React.FC<TAOverviewProps> = ({ data }) => {
  // Default data if no data is passed or if 'General Info' sheet is not found
  const defaultProjectInfo = {
    name: "Miskar Turnaround 2025",
    location: "Miskar Platform, Hannibal Plant",
    duration: "12 days",
    startDate: "01/11/2025",
    endDate: "12/11/2025",
    budget: "$1.5M",
    mainDrivers: ["Miskar DCS Upgrade", "HBG-2030 Mechanical cleaning", "Leftover MOCs from TA24"],
    status: "Phase 2 - Detailed Planning"
  };

  const projectInfo = data ? 
    data.reduce((acc, item) => {
      if (item.Field && item.Value) {
        let key = item.Field.replace(/ /g, '').replace(/\+/g, '').toLowerCase();
        // Specific mapping for 'Main Drivers' to handle array
        if (item.Field === 'Main Drivers') {
          acc['mainDrivers'] = item.Value.split(', ').map((s: string) => s.trim());
        } else {
          acc[key] = item.Value;
        }
      }
      return acc;
    }, {}) : defaultProjectInfo;

  // Ensure mainDrivers is an array even if not explicitly provided or incorrectly parsed
  if (!projectInfo.mainDrivers || !Array.isArray(projectInfo.mainDrivers)) {
    projectInfo.mainDrivers = [];
  }
  
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Turnaround Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Turnaround Details</h3>
            <p className="text-lg font-bold">{projectInfo.taname || defaultProjectInfo.name}</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              {projectInfo.location || defaultProjectInfo.location}
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {projectInfo.status || defaultProjectInfo.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Timeline</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{projectInfo.startdate || defaultProjectInfo.startDate} - {projectInfo.enddate || defaultProjectInfo.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{projectInfo.duration || defaultProjectInfo.duration}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Budget</h3>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xl font-bold">{projectInfo.budget || defaultProjectInfo.budget}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-100">Main Drivers</h3>
            <div className="space-y-1">
              {(projectInfo.mainDrivers.length > 0 ? projectInfo.mainDrivers : defaultProjectInfo.mainDrivers).map((driver: string, index: number) => (
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
