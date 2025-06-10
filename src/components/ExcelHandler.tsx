import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Database, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

import { EXCEL_SHEET_TO_TABLE_MAP, TablesInsert } from '@/types/supabase';

export const ExcelHandler = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data, importDataToSupabase } = useSupabaseData();

  const [isImporting, setIsImporting] = useState(false);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const processedData: Record<string, any[]> = {};

        workbook.SheetNames.forEach(sheetName => {
          const mappedTableName = EXCEL_SHEET_TO_TABLE_MAP[sheetName];
          if (!mappedTableName) {
            console.warn(`Sheet "${sheetName}" does not have a corresponding table in Supabase.`);
            return;
          }

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          processedData[mappedTableName] = jsonData as TablesInsert<typeof mappedTableName>[];
        });

        await importDataToSupabase(processedData);

        toast({
          title: "Import Successful",
          description: "Excel data has been imported into Supabase successfully."
        });
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: "Failed to parse or import Excel file.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!data || Object.keys(data).length === 0) {
      toast({
        title: "No Data Available",
        description: "There is no data to export. Please ensure data is loaded from the database.",
        variant: "destructive"
      });
      return;
    }

    const workbook = XLSX.utils.book_new();

    let hasData = false;

    Object.entries(EXCEL_SHEET_TO_TABLE_MAP).forEach(([sheetName, tableName]) => {
      const sheetData = data[tableName] || [];

      if (sheetData.length > 0) {
        hasData = true;
      }

      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
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
      description: "Live dashboard data exported successfully with all current data from the database."
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
          disabled={isImporting}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isImporting ? "Importing..." : "Import to Database"}
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
 
