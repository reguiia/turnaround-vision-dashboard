
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface MilestonePlanProps {
  phasesData?: any[];
  deliverablesData?: any[];
}

export const MilestonePlan: React.FC<MilestonePlanProps> = ({ phasesData, deliverablesData }) => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const defaultPhases = [
    {
      id: 1,
      name: "Phase 1",
      title: "Scope Development, Optimization & Freeze",
      progress: 95,
      status: "completed",
      dueDate: "2024-12-15",
      deliverables: [
        "Work list development",
        "Scope optimisation (review & challenge) carried out",
        "Scope freeze (all scope, start Addendum process)",
        "Level II schedule created (reconcile duration with Business Plan target)",
        "'Leftover scope' materials ordered & delivery dates confirmed",
        "Stock material reservation process completed (for opportunity scope)",
        "Develop contracting strategy",
        "Risk & Opportunity Register set up",
        "Initiate TA specific HSSE Plan",
        "TAR 2"
      ]
    },
    {
      id: 2,
      name: "Phase 2",
      title: "Detailed Planning",
      progress: 75,
      status: "active",
      dueDate: "2025-03-30",
      deliverables: [
        "Detailed Work Order Operations Completed (including Projects and Plant changes)",
        "ENG MOCs : Detailed Engineering Complete (AFC packages issued)",
        "Operational preparation completed (S/D & S/U procedures, decontamination, isolation,…. )",
        "Detailed work pack completed and reviewed (N2 Purging, Leak Testing, Vessels H-testing, etc..)",
        "Multi-disciplinary Integrated Execution Schedule issued, reconciled with Business Plan Targets",
        "Conduct review of complex work scopes, critical and near-critical path jobs",
        "Schedule Optimisation carried out",
        "Materials ordered and delivery dates confirmed",
        "Purchase orders for vendors providing services in place and availability confirmed",
        "Budget Review performed and issued",
        "Develop flaw lists and risk mitigation actions to avoid delays to execution and start-up activities",
        "TA HSSE Plan completed and HSSE risk register updated",
        "Logistics Plan completed including aviation, marine, land transportation and cranage requirements , etc..",
        "Admin Plan completed including welfare set-up, catering, accomodation and IT requirements, etc..",
        "Turnaround Execution 'Resources Planning Database' developed",
        "Final Turnaround Execution Plan endorsed by all disciplines and issued",
        "TAR 3"
      ]
    },
    {
      id: 3,
      name: "Phase 3",
      title: "Pre-TA",
      progress: 25,
      status: "upcoming",
      dueDate: "2025-10-15",
      deliverables: [
        "All Materials (including Bagging and Tagging) available",
        "All Personnel identified (named) and trained for mobilisation",
        "Pre-Turnaround activities (Prepare the Site) completed",
        "Complete and communicate execution phase administration plan( Meeting structure and schedules, shift schedule, communication protocols for handover, etc.)",
        "Final Assurance Review"
      ]
    },
    {
      id: 4,
      name: "Phase 4",
      title: "TA Execution",
      progress: 0,
      status: "upcoming",
      dueDate: "2025-12-15",
      deliverables: [
        "Daily execution monitoring",
        "Real-time progress tracking",
        "Issue resolution and escalation",
        "Safety compliance monitoring",
        "Quality assurance checks"
      ]
    },
    {
      id: 5,
      name: "Phase 5",
      title: "Post-TA",
      progress: 0,
      status: "upcoming",
      dueDate: "2026-01-30",
      deliverables: [
        "Internal After Action Review Held",
        "Close out Report Completed",
        "Turnaround After Action Review (AAR) completed"
      ]
    }
  ];

  const phases = phasesData && phasesData.length > 0 ? phasesData.map((p: any, index: number) => ({
    id: index + 1,
    name: p.Phase,
    title: p.Milestone,
    progress: p.Progress,
    status: p.Status.toLowerCase().includes('complete') ? 'completed' : (p.Status.toLowerCase().includes('progress') ? 'active' : 'upcoming'),
    dueDate: p.Due_Date,
    deliverables: deliverablesData 
      ? deliverablesData.filter((d: any) => d.Phase === p.Phase).map((d: any) => d.Deliverable)
      : []
  })) : defaultPhases;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getDeliverableProgress = (deliverableName: string, phaseName: string) => {
    const deliverable = deliverablesData?.find(d => d.Deliverable === deliverableName && d.Phase === phaseName);
    return deliverable ? deliverable.Progress : Math.random() * 100; // Fallback to random if not found
  };

  const getDeliverableStatus = (deliverableName: string, phaseName: string) => {
    const deliverable = deliverablesData?.find(d => d.Deliverable === deliverableName && d.Phase === phaseName);
    if (deliverable) {
      return deliverable.Status.toLowerCase().includes('complete') ? "default" : "secondary";
    }
    return Math.random() > 0.7 ? "default" : "secondary"; // Fallback to random
  };


  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Milestone Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline */}
          <div className="relative">
            <div className="flex justify-between items-center">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex flex-col items-center relative">
                  <button
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all hover:scale-110 ${getStatusColor(phase.status)} border-white shadow-lg`}
                  >
                    <span className="text-white font-bold text-sm">{phase.name}</span>
                  </button>
                  <div className="mt-2 text-center">
                    <p className="font-semibold text-sm">{phase.title}</p>
                    <p className="text-xs text-gray-500">{phase.dueDate}</p>
                    <div className="mt-1">
                      {getStatusIcon(phase.status)}
                    </div>
                  </div>
                  <div className="mt-2 w-full">
                    <Progress value={phase.progress} className="h-2" />
                    <p className="text-xs text-center mt-1">{phase.progress}%</p>
                  </div>
                  
                  {index < phases.length - 1 && (
                    <div className="absolute top-8 left-16 w-full h-0.5 bg-gray-300 -z-10"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          {selectedPhase && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg mb-4">
                {phases.find(p => p.id === selectedPhase)?.title} Deliverables
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {phases.find(p => p.id === selectedPhase)?.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border">
                    <div className="w-full">
                      <p className="text-sm">{deliverable}</p>
                      <div className="mt-2">
                        <Progress value={getDeliverableProgress(deliverable, phases.find(p => p.id === selectedPhase)?.name || '')} className="h-1" />
                      </div>
                    </div>
                    <Badge variant={getDeliverableStatus(deliverable, phases.find(p => p.id === selectedPhase)?.name || '')} className="text-xs">
                      {getDeliverableStatus(deliverable, phases.find(p => p.id === selectedPhase)?.name || '') === "default" ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
