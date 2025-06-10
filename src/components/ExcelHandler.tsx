import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

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
        
        // Map sheet names to our expected table names
        const sheetMap: Record<string, string> = {
          'General Info': 'General Info',
          'Bookies Data': 'Bookies Data',
          'Risks': 'Risks',
          'Milestones + Deliverables': 'Milestones + Deliverables',
          'Milestones': 'Milestones + Deliverables',
          'Action Log': 'Action Log',
          'Material Procurement': 'Material Procurement',
          'Service Procurement': 'Service Procurement',
          'Comments-Notes': 'Comments-Notes',
          'Comments': 'Comments-Notes',
          'Deliverables Status': 'Deliverables Status'
        };
        
        const processedData: any = {};
        
        workbook.SheetNames.forEach(sheetName => {
          const tableName = sheetMap[sheetName] || sheetName;
          if (!processedData[tableName]) {
            const worksheet = workbook.Sheets[sheetName];
            processedData[tableName] = XLSX.utils.sheet_to_json(worksheet);
          }
        });

        // Validate we have at least one table with data
        const hasData = Object.values(processedData).some((tableData: any) => 
          Array.isArray(tableData) && tableData.length > 0
        );

        if (!hasData) {
          throw new Error('No valid data found in the Excel file');
        }

        importDataToSupabase(processedData);

      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Failed to parse Excel file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "Failed to read the file",
        variant: "destructive"
      });
    };
    reader.readAsBinaryString(file);
    
    event.target.value = '';
  };

  const handleExport = () => {
    if (!data || Object.keys(data).length === 0) {
      toast({
        title: "No Data Available",
        description: "No data found to export. Please ensure data is loaded from the database.",
        variant: "destructive"
      });
      return;
    }

    const workbook = XLSX.utils.book_new();
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

    let hasData = false;
    sheetNames.forEach(sheetName => {
      const sheetData = data[sheetName] || [];
      if (sheetData.length > 0) {
        hasData = true;
        const ws = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);
      }
    });

    if (!hasData) {
      toast({
        title: "No Data to Export",
        description: "All tables are empty. Please add some data first.",
        variant: "destructive"
      });
      return;
    }

    XLSX.writeFile(workbook, 'turnaround_dashboard_live_data.xlsx');
    
    toast({
      title: "Export Successful",
      description: "Live dashboard data exported successfully with all current data from database."
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="default" className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          Live Supabase Data
        </Badge>
      </div>

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
