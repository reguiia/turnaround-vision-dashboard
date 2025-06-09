
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Database, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';

interface ExcelHandlerProps {
  onImportSuccess: (data: any) => void;
}

export const ExcelHandler: React.FC<ExcelHandlerProps> = ({ onImportSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [importedData, setImportedData] = useState<any>(null); // Keep this local state to manage badge

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Process each sheet
        const sheets = workbook.SheetNames;
        console.log('Imported sheets:', sheets);
        
        // Process specific sheets
        const processedData: any = {};
        
        sheets.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          processedData[sheetName] = jsonData;
          console.log(`${sheetName} data:`, jsonData);
        });

        // Store the imported data in local state for badge, and pass to parent
        setImportedData(processedData);
        onImportSuccess(processedData); // Pass data to the parent component

        toast({
          title: "Import Successful",
          description: `Imported data from ${sheets.length} sheets successfully.`
        });
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsBinaryString(file);
    
    // Reset file input
    event.target.value = '';
  };

  const getDefaultData = () => {
    return {
      'General Info': [
        { Field: 'TA Name', Value: 'Major Turnaround 2025' },
        { Field: 'Location', Value: 'Refinery Unit A' },
        { Field: 'Duration', Value: '45 days' },
        { Field: 'Start Date', Value: '01/11/2025' },
        { Field: 'End Date', Value: '15/12/2025' },
        { Field: 'Budget', Value: '$12.5M' },
        { Field: 'Status', Value: 'Phase 2 - Detailed Planning' },
        { Field: 'Main Drivers', Value: 'Catalyst Replacement, Heat Exchanger Maintenance, Safety Upgrades' }
      ],
      'Bookies Data': [
        { Area: 'Material', Target: 90, Actual: 75 },
        { Area: 'Resources', Target: 85, Actual: 80 },
        { Area: 'Field Support Services', Target: 80, Actual: 70 },
        { Area: 'Workpack', Target: 95, Actual: 85 },
        { Area: 'Schedule Preparation', Target: 88, Actual: 92 }
      ],
      'Risks': [
        { Risk_ID: 'R001', Risk_Name: 'Material Delivery Delays', Probability: 70, Impact: 85, Risk_Score: 59.5, Mitigation: 'Early ordering and backup suppliers' },
        { Risk_ID: 'R002', Risk_Name: 'Weather Conditions', Probability: 60, Impact: 65, Risk_Score: 39, Mitigation: 'Weather monitoring and contingency plans' },
        { Risk_ID: 'R003', Risk_Name: 'Resource Availability', Probability: 45, Impact: 90, Risk_Score: 40.5, Mitigation: 'Multi-skilled workforce and contractor backup' },
        { Risk_ID: 'R004', Risk_Name: 'Equipment Failure', Probability: 30, Impact: 95, Risk_Score: 28.5, Mitigation: 'Preventive maintenance and spare equipment' },
        { Risk_ID: 'R005', Risk_Name: 'Permit Delays', Probability: 55, Impact: 70, Risk_Score: 38.5, Mitigation: 'Early permit applications and regulatory liaison' }
      ],
      'Milestones + Deliverables': [
        { Phase: 'Phase 1', Milestone: 'Scope Development, Optimization & Freeze', Progress: 100, Due_Date: '30/06/2025', Status: 'Complete' },
        { Phase: 'Phase 2', Milestone: 'Detailed Planning', Progress: 75, Due_Date: '31/08/2025', Status: 'In Progress' },
        { Phase: 'Phase 3', Milestone: 'Pre-TA', Progress: 25, Due_Date: '31/10/2025', Status: 'Planned' },
        { Phase: 'Phase 4', Milestone: 'TA Execution', Progress: 0, Due_Date: '15/12/2025', Status: 'Planned' },
        { Phase: 'Phase 5', Milestone: 'Post-TA', Progress: 0, Due_Date: '31/01/2026', Status: 'Planned' }
      ],
      'Action Log': [
        { Action_ID: 'A001', Source: 'DM', Description: 'Update material specifications', Status: 'Open', Due_Date: '15/06/2025', Owner: 'John Smith' },
        { Action_ID: 'A002', Source: 'SCM', Description: 'Finalize vendor contracts', Status: 'Closed', Due_Date: '10/06/2025', Owner: 'Jane Doe' },
        { Action_ID: 'A003', Source: 'TAR2', Description: 'Complete safety assessment', Status: 'Due', Due_Date: '20/06/2025', Owner: 'Mike Johnson' },
        { Action_ID: 'A004', Source: 'TAR3', Description: 'Update project timeline', Status: 'Open', Due_Date: '25/06/2025', Owner: 'Sarah Wilson' },
        { Action_ID: 'A005', Source: 'RA', Description: 'Risk register update', Status: 'Closed', Due_Date: '12/06/2025', Owner: 'Tom Brown' }
      ],
      'Material Procurement': [
        { Material_ID: 'M001', Material_Name: 'Catalyst Type A', Initiation_Date: '10/02/2025', Lead_Time_Days: 180, Required_Date: '01/11/2025', Status: 'On Track', Supplier: 'ABC Chemicals' },
        { Material_ID: 'M002', Material_Name: 'Heat Exchanger Tubes', Initiation_Date: '15/02/2025', Lead_Time_Days: 120, Required_Date: '01/11/2025', Status: 'At Risk', Supplier: 'XYZ Manufacturing' },
        { Material_ID: 'M003', Material_Name: 'Safety Valves', Initiation_Date: '20/02/2025', Lead_Time_Days: 90, Required_Date: '01/11/2025', Status: 'On Track', Supplier: 'Safety Corp' },
        { Material_ID: 'M004', Material_Name: 'Gaskets & Seals', Initiation_Date: '25/02/2025', Lead_Time_Days: 60, Required_Date: '01/11/2025', Status: 'Complete', Supplier: 'Seal Tech' },
        { Material_ID: 'M005', Material_Name: 'Instrumentation', Initiation_Date: '01/03/2025', Lead_Time_Days: 150, Required_Date: '01/11/2025', Status: 'On Track', Supplier: 'Instrument Co' }
      ],
      'Service Procurement': [
        { Service_ID: 'S001', Service_Name: 'Scaffolding Services', Initiation_Date: '05/03/2025', Lead_Time_Days: 90, Required_Date: '01/11/2025', Status: 'On Track', Provider: 'Scaffold Pro' },
        { Service_ID: 'S002', Service_Name: 'Crane Services', Initiation_Date: '10/03/2025', Lead_Time_Days: 120, Required_Date: '01/11/2025', Status: 'At Risk', Provider: 'Heavy Lift Inc' },
        { Service_ID: 'S003', Service_Name: 'Welding Services', Initiation_Date: '15/03/2025', Lead_Time_Days: 60, Required_Date: '01/11/2025', Status: 'Complete', Provider: 'Weld Masters' },
        { Service_ID: 'S004', Service_Name: 'Inspection Services', Initiation_Date: '20/03/2025', Lead_Time_Days: 75, Required_Date: '01/11/2025', Status: 'On Track', Provider: 'Inspect Tech' },
        { Service_ID: 'S005', Service_Name: 'Cleaning Services', Initiation_Date: '25/03/2025', Lead_Time_Days: 45, Required_Date: '01/11/2025', Status: 'On Track', Provider: 'Clean Corp' }
      ],
      'Comments-Notes': [
        { Date: '04/06/2025', Author: 'Project Manager', Category: 'General', Comment: 'Project tracking well against milestones' },
        { Date: '03/06/2025', Author: 'Risk Manager', Category: 'Risk', Comment: 'Weather risk monitoring increased due to seasonal changes' },
        { Date: '02/06/2025', Author: 'Procurement Lead', Category: 'Materials', Comment: 'Heat exchanger delivery may be delayed - investigating alternatives' },
        { Date: '01/06/2025', Author: 'Safety Manager', Category: 'Safety', Comment: 'All safety permits on track for approval' }
      ],
      'Deliverables Status': [
        // Phase 1 Deliverables
        { Phase: 'Phase 1', Deliverable: 'Work list development', Progress: 100, Status: 'Complete', Due_Date: '15/05/2025', Owner: 'Engineering Team' },
        { Phase: 'Phase 1', Deliverable: 'Scope optimisation (review & challenge) carried out', Progress: 100, Status: 'Complete', Due_Date: '20/05/2025', Owner: 'Project Manager' },
        { Phase: 'Phase 1', Deliverable: 'Scope freeze (all scope, start Addendum process)', Progress: 100, Status: 'Complete', Due_Date: '25/05/2025', Owner: 'Project Manager' },
        { Phase: 'Phase 1', Deliverable: 'Level II schedule created (reconcile duration with Business Plan target)', Progress: 100, Status: 'Complete', Due_Date: '30/05/2025', Owner: 'Planning Team' },
        { Phase: 'Phase 1', Deliverable: "'Leftover scope' materials ordered & delivery dates confirmed", Progress: 100, Status: 'Complete', Due_Date: '05/06/2025', Owner: 'Procurement Team' },
        { Phase: 'Phase 1', Deliverable: 'Stock material reservation process completed (for opportunity scope)', Progress: 100, Status: 'Complete', Due_Date: '10/06/2025', Owner: 'Procurement Team' },
        { Phase: 'Phase 1', Deliverable: 'Develop contracting strategy', Progress: 100, Status: 'Complete', Due_Date: '15/06/2025', Owner: 'Contracts Team' },
        { Phase: 'Phase 1', Deliverable: 'Risk & Opportunity Register set up', Progress: 100, Status: 'Complete', Due_Date: '20/06/2025', Owner: 'Risk Manager' },
        { Phase: 'Phase 1', Deliverable: 'Initiate TA specific HSSE Plan', Progress: 100, Status: 'Complete', Due_Date: '25/06/2025', Owner: 'HSSE Manager' },
        { Phase: 'Phase 1', Deliverable: 'TAR 2', Progress: 100, Status: 'Complete', Due_Date: '30/06/2025', Owner: 'Project Team' },
        
        // Phase 2 Deliverables
        { Phase: 'Phase 2', Deliverable: 'Detailed Work Order Operations Completed (including Projects and Plant changes)', Progress: 85, Status: 'In Progress', Due_Date: '15/07/2025', Owner: 'Operations Team' },
        { Phase: 'Phase 2', Deliverable: 'ENG MOCs : Detailed Engineering Complete (AFC packages issued)', Progress: 90, Status: 'In Progress', Due_Date: '20/07/2025', Owner: 'Engineering Team' },
        { Phase: 'Phase 2', Deliverable: 'Operational preparation completed (S/D & S/U procedures, decontamination, isolation)', Progress: 70, Status: 'In Progress', Due_Date: '25/07/2025', Owner: 'Operations Team' },
        { Phase: 'Phase 2', Deliverable: 'Detailed work pack completed and reviewed (N2 Purging, Leak Testing, Vessels H-testing)', Progress: 60, Status: 'In Progress', Due_Date: '30/07/2025', Owner: 'Technical Team' },
        { Phase: 'Phase 2', Deliverable: 'Multi-disciplinary Integrated Execution Schedule issued, reconciled with Business Plan Targets', Progress: 80, Status: 'In Progress', Due_Date: '05/08/2025', Owner: 'Planning Team' },
        { Phase: 'Phase 2', Deliverable: 'Conduct review of complex work scopes, critical and near-critical path jobs', Progress: 75, Status: 'In Progress', Due_Date: '10/08/2025', Owner: 'Technical Team' },
        { Phase: 'Phase 2', Deliverable: 'Schedule Optimisation carried out', Progress: 85, Status: 'In Progress', Due_Date: '15/08/2025', Owner: 'Planning Team' },
        { Phase: 'Phase 2', Deliverable: 'Materials ordered and delivery dates confirmed', Progress: 90, Status: 'In Progress', Due_Date: '20/08/2025', Owner: 'Procurement Team' },
        { Phase: 'Phase 2', Deliverable: 'Purchase orders for vendors providing services in place and availability confirmed', Progress: 80, Status: 'In Progress', Due_Date: '25/08/2025', Owner: 'Procurement Team' },
        { Phase: 'Phase 2', Deliverable: 'Budget Review performed and issued', Progress: 95, Status: 'In Progress', Due_Date: '30/08/2025', Owner: 'Finance Team' },
        
        // Phase 3 Deliverables
        { Phase: 'Phase 3', Deliverable: 'All Materials (including Bagging and Tagging) available', Progress: 30, Status: 'Planned', Due_Date: '15/09/2025', Owner: 'Procurement Team' },
        { Phase: 'Phase 3', Deliverable: 'All Personnel identified (named) and trained for mobilisation', Progress: 20, Status: 'Planned', Due_Date: '20/09/2025', Owner: 'HR Team' },
        { Phase: 'Phase 3', Deliverable: 'Pre-Turnaround activities (Prepare the Site) completed', Progress: 25, Status: 'Planned', Due_Date: '25/09/2025', Owner: 'Site Team' },
        { Phase: 'Phase 3', Deliverable: 'Complete and communicate execution phase administration plan', Progress: 15, Status: 'Planned', Due_Date: '30/09/2025', Owner: 'Admin Team' },
        { Phase: 'Phase 3', Deliverable: 'Final Assurance Review', Progress: 10, Status: 'Planned', Due_Date: '31/10/2025', Owner: 'QA Team' },
        
        // Phase 4 Deliverables
        { Phase: 'Phase 4', Deliverable: 'Daily execution monitoring', Progress: 0, Status: 'Not Started', Due_Date: '01/11/2025', Owner: 'Execution Team' },
        { Phase: 'Phase 4', Deliverable: 'Real-time progress tracking', Progress: 0, Status: 'Not Started', Due_Date: '01/11/2025', Owner: 'Planning Team' },
        { Phase: 'Phase 4', Deliverable: 'Issue resolution and escalation', Progress: 0, Status: 'Not Started', Due_Date: '01/11/2025', Owner: 'Project Manager' },
        { Phase: 'Phase 4', Deliverable: 'Safety compliance monitoring', Progress: 0, Status: 'Not Started', Due_Date: '01/11/2025', Owner: 'HSSE Manager' },
        { Phase: 'Phase 4', Deliverable: 'Quality assurance checks', Progress: 0, Status: 'Not Started', Due_Date: '01/11/2025', Owner: 'QA Team' },
        
        // Phase 5 Deliverables
        { Phase: 'Phase 5', Deliverable: 'Internal After Action Review Held', Progress: 0, Status: 'Not Started', Due_Date: '20/12/2025', Owner: 'Project Team' },
        { Phase: 'Phase 5', Deliverable: 'Close out Report Completed', Progress: 0, Status: 'Not Started', Due_Date: '15/01/2026', Owner: 'Project Manager' },
        { Phase: 'Phase 5', Deliverable: 'Turnaround After Action Review (AAR) completed', Progress: 0, Status: 'Not Started', Due_Date: '31/01/2026', Owner: 'Project Team' }
      ]
    };
  };

  const handleExport = () => {
    // Use imported data if available, otherwise use default data
    const dataToExport = importedData || getDefaultData();
    
    // Create comprehensive data structure for export
    const workbook = XLSX.utils.book_new();
    
    // Create sheets from the data (imported or default)
    const sheetNames = [
      'General Info',
      'Bookies Data',
      'Risks',
      'Milestones + Deliverables',
      'Action Log',
      'Material Procurement',
      'Service Procurement',
      'Comments-Notes',
      'Deliverables Status'
    ];

    sheetNames.forEach(sheetName => {
      const sheetData = dataToExport[sheetName] || [];
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    });

    // Export the file
    XLSX.writeFile(workbook, 'turnaround_dashboard_comprehensive.xlsx');
    
    const dataSource = importedData ? "imported" : "default mock";
    toast({
      title: "Export Successful",
      description: `Complete dashboard data exported with all 9 sheets using ${dataSource} data.`
    });
  };

  const clearImportedData = () => {
    setImportedData(null); // Clear local state
    onImportSuccess(null); // Clear parent state
    toast({
      title: "Data Cleared",
      description: "Imported data has been cleared. Export will now use default data."
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Data Source Indicator */}
      <div className="flex items-center gap-2">
        <Badge variant={importedData ? "default" : "secondary"} className="flex items-center gap-1">
          {importedData ? <Database className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
          {importedData ? "Using Imported Data" : "Using Default Data"}
        </Badge>
        {importedData && (
          <Button 
            onClick={clearImportedData}
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Import/Export Buttons */}
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="border-blue-200 hover:bg-blue-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Excel
        </Button>
        
        <Button 
          onClick={handleExport}
          variant="outline"
          className="border-green-200 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};
