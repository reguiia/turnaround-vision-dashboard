
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export const ExcelHandler = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

        // Here you would typically update your application state with the imported data
        // For now, we'll just log it and show success message

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

  const handleExport = () => {
    // Create comprehensive data structure for export
    const workbook = XLSX.utils.book_new();
    
    // Sheet1: General Info
    const generalInfo = [
      { Field: 'TA Name', Value: 'Major Turnaround 2025' },
      { Field: 'Location', Value: 'Refinery Unit A' },
      { Field: 'Duration', Value: '45 days' },
      { Field: 'Start Date', Value: '01/11/2025' },
      { Field: 'End Date', Value: '15/12/2025' },
      { Field: 'Budget', Value: '$12.5M' },
      { Field: 'Status', Value: 'Phase 2 - Detailed Planning' },
      { Field: 'Main Drivers', Value: 'Catalyst Replacement, Heat Exchanger Maintenance, Safety Upgrades' }
    ];
    const ws1 = XLSX.utils.json_to_sheet(generalInfo);
    XLSX.utils.book_append_sheet(workbook, ws1, 'General Info');

    // Sheet2: Bookies Data (target vs actual)
    const bookiesData = [
      { Area: 'Material', Target: 90, Actual: 75 },
      { Area: 'Resources', Target: 85, Actual: 80 },
      { Area: 'Field Support Services', Target: 80, Actual: 70 },
      { Area: 'Workpack', Target: 95, Actual: 85 },
      { Area: 'Schedule Preparation', Target: 88, Actual: 92 }
    ];
    const ws2 = XLSX.utils.json_to_sheet(bookiesData);
    XLSX.utils.book_append_sheet(workbook, ws2, 'Bookies Data');

    // Sheet3: Risks
    const risksData = [
      { Risk_ID: 'R001', Risk_Name: 'Material Delivery Delays', Probability: 70, Impact: 85, Risk_Score: 59.5, Mitigation: 'Early ordering and backup suppliers' },
      { Risk_ID: 'R002', Risk_Name: 'Weather Conditions', Probability: 60, Impact: 65, Risk_Score: 39, Mitigation: 'Weather monitoring and contingency plans' },
      { Risk_ID: 'R003', Risk_Name: 'Resource Availability', Probability: 45, Impact: 90, Risk_Score: 40.5, Mitigation: 'Multi-skilled workforce and contractor backup' },
      { Risk_ID: 'R004', Risk_Name: 'Equipment Failure', Probability: 30, Impact: 95, Risk_Score: 28.5, Mitigation: 'Preventive maintenance and spare equipment' },
      { Risk_ID: 'R005', Risk_Name: 'Permit Delays', Probability: 55, Impact: 70, Risk_Score: 38.5, Mitigation: 'Early permit applications and regulatory liaison' }
    ];
    const ws3 = XLSX.utils.json_to_sheet(risksData);
    XLSX.utils.book_append_sheet(workbook, ws3, 'Risks');

    // Sheet4: Milestones + Deliverables
    const milestonesData = [
      { Phase: 'Phase 1', Milestone: 'Scope Development, Optimization & Freeze', Progress: 100, Due_Date: '30/06/2025', Status: 'Complete' },
      { Phase: 'Phase 2', Milestone: 'Detailed Planning', Progress: 75, Due_Date: '31/08/2025', Status: 'In Progress' },
      { Phase: 'Phase 3', Milestone: 'Pre-TA', Progress: 25, Due_Date: '31/10/2025', Status: 'Planned' },
      { Phase: 'Phase 4', Milestone: 'TA Execution', Progress: 0, Due_Date: '15/12/2025', Status: 'Planned' },
      { Phase: 'Phase 5', Milestone: 'Post-TA', Progress: 0, Due_Date: '31/01/2026', Status: 'Planned' }
    ];
    const ws4 = XLSX.utils.json_to_sheet(milestonesData);
    XLSX.utils.book_append_sheet(workbook, ws4, 'Milestones + Deliverables');

    // Sheet5: Action Log
    const actionLogData = [
      { Action_ID: 'A001', Source: 'DM', Description: 'Update material specifications', Status: 'Open', Due_Date: '15/06/2025', Owner: 'John Smith' },
      { Action_ID: 'A002', Source: 'SCM', Description: 'Finalize vendor contracts', Status: 'Closed', Due_Date: '10/06/2025', Owner: 'Jane Doe' },
      { Action_ID: 'A003', Source: 'TAR2', Description: 'Complete safety assessment', Status: 'Due', Due_Date: '20/06/2025', Owner: 'Mike Johnson' },
      { Action_ID: 'A004', Source: 'TAR3', Description: 'Update project timeline', Status: 'Open', Due_Date: '25/06/2025', Owner: 'Sarah Wilson' },
      { Action_ID: 'A005', Source: 'RA', Description: 'Risk register update', Status: 'Closed', Due_Date: '12/06/2025', Owner: 'Tom Brown' }
    ];
    const ws5 = XLSX.utils.json_to_sheet(actionLogData);
    XLSX.utils.book_append_sheet(workbook, ws5, 'Action Log');

    // Sheet6: Material Procurement
    const materialProcurementData = [
      { Material_ID: 'M001', Material_Name: 'Catalyst Type A', Initiation_Date: '10/02/2025', Lead_Time_Days: 180, Required_Date: '01/11/2025', Status: 'On Track', Supplier: 'ABC Chemicals' },
      { Material_ID: 'M002', Material_Name: 'Heat Exchanger Tubes', Initiation_Date: '15/02/2025', Lead_Time_Days: 120, Required_Date: '01/11/2025', Status: 'At Risk', Supplier: 'XYZ Manufacturing' },
      { Material_ID: 'M003', Material_Name: 'Safety Valves', Initiation_Date: '20/02/2025', Lead_Time_Days: 90, Required_Date: '01/11/2025', Status: 'On Track', Supplier: 'Safety Corp' },
      { Material_ID: 'M004', Material_Name: 'Gaskets & Seals', Initiation_Date: '25/02/2025', Lead_Time_Days: 60, Required_Date: '01/11/2025', Status: 'Complete', Supplier: 'Seal Tech' },
      { Material_ID: 'M005', Material_Name: 'Instrumentation', Initiation_Date: '01/03/2025', Lead_Time_Days: 150, Required_Date: '01/11/2025', Status: 'On Track', Supplier: 'Instrument Co' }
    ];
    const ws6 = XLSX.utils.json_to_sheet(materialProcurementData);
    XLSX.utils.book_append_sheet(workbook, ws6, 'Material Procurement');

    // Sheet7: Service Procurement
    const serviceProcurementData = [
      { Service_ID: 'S001', Service_Name: 'Scaffolding Services', Initiation_Date: '05/03/2025', Lead_Time_Days: 90, Required_Date: '01/11/2025', Status: 'On Track', Provider: 'Scaffold Pro' },
      { Service_ID: 'S002', Service_Name: 'Crane Services', Initiation_Date: '10/03/2025', Lead_Time_Days: 120, Required_Date: '01/11/2025', Status: 'At Risk', Provider: 'Heavy Lift Inc' },
      { Service_ID: 'S003', Service_Name: 'Welding Services', Initiation_Date: '15/03/2025', Lead_Time_Days: 60, Required_Date: '01/11/2025', Status: 'Complete', Provider: 'Weld Masters' },
      { Service_ID: 'S004', Service_Name: 'Inspection Services', Initiation_Date: '20/03/2025', Lead_Time_Days: 75, Required_Date: '01/11/2025', Status: 'On Track', Provider: 'Inspect Tech' },
      { Service_ID: 'S005', Service_Name: 'Cleaning Services', Initiation_Date: '25/03/2025', Lead_Time_Days: 45, Required_Date: '01/11/2025', Status: 'On Track', Provider: 'Clean Corp' }
    ];
    const ws7 = XLSX.utils.json_to_sheet(serviceProcurementData);
    XLSX.utils.book_append_sheet(workbook, ws7, 'Service Procurement');

    // Sheet8: Comments/Notes
    const commentsData = [
      { Date: '04/06/2025', Author: 'Project Manager', Category: 'General', Comment: 'Project tracking well against milestones' },
      { Date: '03/06/2025', Author: 'Risk Manager', Category: 'Risk', Comment: 'Weather risk monitoring increased due to seasonal changes' },
      { Date: '02/06/2025', Author: 'Procurement Lead', Category: 'Materials', Comment: 'Heat exchanger delivery may be delayed - investigating alternatives' },
      { Date: '01/06/2025', Author: 'Safety Manager', Category: 'Safety', Comment: 'All safety permits on track for approval' }
    ];
    const ws8 = XLSX.utils.json_to_sheet(commentsData);
    XLSX.utils.book_append_sheet(workbook, ws8, 'Comments-Notes');

    // Export the file
    XLSX.writeFile(workbook, 'turnaround_dashboard_comprehensive.xlsx');
    
    toast({
      title: "Export Successful",
      description: "Complete dashboard data exported with all 8 sheets successfully."
    });
  };

  return (
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
  );
};
