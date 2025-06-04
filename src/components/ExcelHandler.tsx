
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
        
        sheets.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log(`${sheetName} data:`, jsonData);
        });

        toast({
          title: "Import Successful",
          description: `Imported data from ${sheets.length} sheets successfully.`
        });
      } catch (error) {
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
    // Create sample data structure for export
    const workbook = XLSX.utils.book_new();
    
    // Sheet1: General Info
    const generalInfo = [
      { Field: 'TA Name', Value: 'Major Turnaround 2025' },
      { Field: 'Location', Value: 'Refinery Unit A' },
      { Field: 'Duration', Value: '45 days' },
      { Field: 'Start Date', Value: '01/11/2025' },
      { Field: 'End Date', Value: '15/12/2025' },
      { Field: 'Budget', Value: '$12.5M' },
      { Field: 'Status', Value: 'Phase 2 - Detailed Planning' }
    ];
    const ws1 = XLSX.utils.json_to_sheet(generalInfo);
    XLSX.utils.book_append_sheet(workbook, ws1, 'General Info');

    // Sheet2: Bookies Data
    const bookiesData = [
      { Area: 'Material', Target: 90, Measured: 75 },
      { Area: 'Resources', Target: 85, Measured: 80 },
      { Area: 'Field Support Services', Target: 80, Measured: 70 },
      { Area: 'Workpack', Target: 95, Measured: 85 },
      { Area: 'Schedule Preparation', Target: 88, Measured: 92 }
    ];
    const ws2 = XLSX.utils.json_to_sheet(bookiesData);
    XLSX.utils.book_append_sheet(workbook, ws2, 'Bookies Data');

    // Sheet3: Risks
    const risksData = [
      { Risk: 'Material Delivery Delays', Probability: 70, Impact: 85, Score: 59.5 },
      { Risk: 'Weather Conditions', Probability: 60, Impact: 65, Score: 39 },
      { Risk: 'Resource Availability', Probability: 45, Impact: 90, Score: 40.5 },
      { Risk: 'Equipment Failure', Probability: 30, Impact: 95, Score: 28.5 },
      { Risk: 'Permit Delays', Probability: 55, Impact: 70, Score: 38.5 }
    ];
    const ws3 = XLSX.utils.json_to_sheet(risksData);
    XLSX.utils.book_append_sheet(workbook, ws3, 'Risks');

    // Export the file
    XLSX.writeFile(workbook, 'turnaround_dashboard_data.xlsx');
    
    toast({
      title: "Export Successful",
      description: "Dashboard data exported to Excel file successfully."
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
