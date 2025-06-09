
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Database, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export const ExcelHandler = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data, importDataToSupabase } = useSupabaseData();

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

        // Import data to Supabase
        importDataToSupabase(processedData);

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
    // Use current Supabase data for export
    const workbook = XLSX.utils.book_new();
    
    // Create sheets from the Supabase data
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
      const sheetData = data[sheetName] || [];
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    });

    // Export the file
    XLSX.writeFile(workbook, 'turnaround_dashboard_live_data.xlsx');
    
    toast({
      title: "Export Successful",
      description: "Live dashboard data exported successfully with all current data from database."
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Data Source Indicator */}
      <div className="flex items-center gap-2">
        <Badge variant="default" className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          Live Supabase Data
        </Badge>
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
          Import to Database
        </Button>
        
        <Button 
          onClick={handleExport}
          variant="outline"
          className="border-green-200 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Live Data
        </Button>
      </div>
    </div>
  );
};
