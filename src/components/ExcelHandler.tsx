import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Database, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

// Mapping between Excel sheet names and database table names
const SHEET_TABLE_MAPPING: Record<string, string> = {
  'General Info': 'general_info',
  'Bookies Data': 'bookies_data',
  'Risks': 'risks',
  'Milestones + Deliverables': 'milestones',
  'Action Log': 'action_log',
  'Material Procurement': 'material_procurement',
  'Service Procurement': 'service_procurement',
  'Comments-Notes': 'comments_notes',
  'Deliverables Status': 'deliverables_status'
};

// Required fields for each table
const REQUIRED_FIELDS: Record<string, string[]> = {
  general_info: ['field', 'value'],
  bookies_data: ['area', 'target', 'actual'],
  risks: ['risk_id', 'risk_name', 'probability', 'impact', 'risk_score'],
  milestones: ['milestone', 'phase', 'due_date', 'status'],
  action_log: ['action_id', 'source', 'description', 'status', 'due_date', 'owner'],
  material_procurement: ['material_id', 'material_name', 'supplier', 'initiation_date', 'required_date', 'lead_time_days', 'status'],
  service_procurement: ['service_id', 'service_name', 'provider', 'initiation_date', 'required_date', 'lead_time_days', 'status'],
  comments_notes: ['author', 'category', 'comment', 'date'],
  deliverables_status: ['deliverable', 'phase', 'owner', 'due_date', 'status']
};

export const ExcelHandler = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data, importDataToSupabase } = useSupabaseData();

  // Validate data structure
  const validateRowData = (tableName: string, rowData: any): string[] => {
    const errors: string[] = [];
    const requiredFields = REQUIRED_FIELDS[tableName] || [];
    
    requiredFields.forEach(field => {
      if (!rowData.hasOwnProperty(field) || rowData[field] === null || rowData[field] === undefined || rowData[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    return errors;
  };

  // Column name mapping for each table
  const COLUMN_MAPPINGS: Record<string, Record<string, string>> = {
    action_log: {
      'Action_ID': 'action_id',
      'action_id': 'action_id',
      'Source': 'source',
      'source': 'source',
      'Description': 'description',
      'description': 'description',
      'Status': 'status',
      'status': 'status',
      'Due_Date': 'due_date',
      'due_date': 'due_date',
      'Owner': 'owner',
      'owner': 'owner'
    },
    general_info: {
      'Field': 'field',
      'field': 'field',
      'Value': 'value',
      'value': 'value'
    },
    bookies_data: {
      'Area': 'area',
      'area': 'area',
      'Target': 'target',
      'target': 'target',
      'Actual': 'actual',
      'actual': 'actual'
    },
    risks: {
      'Risk_ID': 'risk_id',
      'risk_id': 'risk_id',
      'Risk_Name': 'risk_name',
      'risk_name': 'risk_name',
      'Probability': 'probability',
      'probability': 'probability',
      'Impact': 'impact',
      'impact': 'impact',
      'Risk_Score': 'risk_score',
      'risk_score': 'risk_score',
      'Mitigation': 'mitigation',
      'mitigation': 'mitigation'
    }
  };

  // Parse DD/MM/YYYY or DD-MM-YYYY date format to YYYY-MM-DD
  const parseDate = (dateString: string): string => {
    if (!dateString) return '';
    
    // Handle different date formats
    const dateStr = dateString.toString().trim();
    
    // Try DD/MM/YYYY or DD-MM-YYYY format first
    const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Try YYYY-MM-DD format
    const yyyymmddMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmddMatch) {
      return dateStr; // Already in correct format
    }
    
    // Try to parse as regular date
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0];
    }
    
    console.warn(`Could not parse date: ${dateString}`);
    return '';
  };

  // Clean and transform data for database
  const transformDataForDatabase = (tableName: string, rawData: any[]): any[] => {
    const columnMapping = COLUMN_MAPPINGS[tableName] || {};
    
    return rawData.map((row, index) => {
      // Remove empty rows
      const hasData = Object.values(row).some(value => 
        value !== null && value !== undefined && value !== ''
      );
      
      if (!hasData) return null;

      const transformedRow: any = {};
      
      // Map and transform each field
      Object.keys(row).forEach(originalKey => {
        let value = row[originalKey];
        
        // Skip empty values
        if (value === null || value === undefined || value === '') {
          return;
        }
        
        // Get the correct database column name
        const dbColumnName = columnMapping[originalKey] || originalKey.toLowerCase().replace(/\s+/g, '_');
        
        // Skip Excel's internal id column - let database generate UUID
        if (originalKey.toLowerCase() === 'id' && tableName !== 'general_info') {
          return;
        }
        
        // Handle dates
        if (dbColumnName.includes('date') || originalKey.toLowerCase().includes('date')) {
          if (typeof value === 'number') {
            // Excel date serial number
            const excelDate = new Date((value - 25569) * 86400 * 1000);
            value = excelDate.toISOString().split('T')[0];
          } else if (value && typeof value === 'string') {
            value = parseDate(value);
          }
        }
        
        // Handle numbers
        else if (dbColumnName.includes('progress') || dbColumnName.includes('score') || 
                 dbColumnName.includes('impact') || dbColumnName.includes('probability') || 
                 dbColumnName.includes('actual') || dbColumnName.includes('target') ||
                 dbColumnName.includes('lead_time')) {
          value = parseFloat(value) || 0;
        }
        
        // Convert to string and trim
        else if (typeof value === 'string') {
          value = value.trim();
        }
        
        transformedRow[dbColumnName] = value;
      });

      // Don't add timestamps - let database handle them
      // The database should auto-generate created_at and updated_at

      return transformedRow;
    }).filter(row => row !== null);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const sheets = workbook.SheetNames;
        console.log('Available sheets:', sheets);
        
        const processedData: Record<string, any[]> = {};
        const importErrors: string[] = [];
        
        // Process each sheet
        for (const sheetName of sheets) {
          // Check if we have a mapping for this sheet
          const tableName = SHEET_TABLE_MAPPING[sheetName];
          if (!tableName) {
            console.warn(`No mapping found for sheet: ${sheetName}`);
            importErrors.push(`Unknown sheet: ${sheetName}`);
            continue;
          }

          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet);
          
          if (rawData.length === 0) {
            console.log(`Sheet ${sheetName} is empty, skipping...`);
            continue;
          }

          console.log(`Processing sheet: ${sheetName} -> table: ${tableName}`);
          console.log(`Raw data columns:`, Object.keys(rawData[0] || {}));
          console.log(`Raw data sample:`, rawData[0]);

          // Transform data for database
          const transformedData = transformDataForDatabase(tableName, rawData);
          console.log(`Transformed data sample:`, transformedData[0]);
          console.log(`Transformed columns:`, Object.keys(transformedData[0] || {}));
          
          // Validate each row
          const validationErrors: string[] = [];
          transformedData.forEach((row, index) => {
            const rowErrors = validateRowData(tableName, row);
            if (rowErrors.length > 0) {
              validationErrors.push(`Row ${index + 1}: ${rowErrors.join(', ')}`);
            }
          });

          if (validationErrors.length > 0) {
            console.warn(`Validation errors for ${sheetName}:`, validationErrors);
            importErrors.push(`${sheetName}: ${validationErrors.slice(0, 2).join('; ')}`);
            // Don't skip - let's try to import what we can
          }

          processedData[tableName] = transformedData;
          console.log(`Final processed data for ${tableName}:`, transformedData);
        }

        // Show validation errors if any
        if (importErrors.length > 0) {
          toast({
            title: "Import Validation Errors",
            description: importErrors.slice(0, 3).join('\n') + (importErrors.length > 3 ? '\n...' : ''),
            variant: "destructive"
          });
          console.error('Import validation errors:', importErrors);
        }

        // Only proceed if we have valid data
        if (Object.keys(processedData).length === 0) {
          toast({
            title: "No Valid Data",
            description: "No valid data found to import. Please check your Excel file format.",
            variant: "destructive"
          });
          return;
        }

        // Import data to Supabase with error handling
        console.log('Importing to Supabase:', processedData);
        
        try {
          const result = await importDataToSupabase(processedData);
          
          // Check if the import function returns success/error info
          if (result === false || (result && result.error)) {
            throw new Error(result?.error || 'Import to database failed');
          }

          toast({
            title: "Import Successful",
            description: `Successfully imported data for ${Object.keys(processedData).length} table(s).`,
            variant: "default"
          });

        } catch (dbError) {
          console.error('Database import error:', dbError);
          toast({
            title: "Database Import Failed",
            description: `Failed to save data to database: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`,
            variant: "destructive"
          });
        }

      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: `Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    };
    
    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const handleExport = () => {
    console.log('Export data:', data);
    
    if (!data || Object.keys(data).length === 0) {
      toast({
        title: "No Data Available",
        description: "No data found to export. Please ensure data is loaded from the database.",
        variant: "destructive"
      });
      return;
    }

    const workbook = XLSX.utils.book_new();
    
    // Create sheets from the Supabase data using the reverse mapping
    const reverseMapping = Object.fromEntries(
      Object.entries(SHEET_TABLE_MAPPING).map(([sheet, table]) => [table, sheet])
    );

    let hasData = false;
    
    Object.entries(data).forEach(([tableName, tableData]) => {
      const sheetName = reverseMapping[tableName] || tableName;
      console.log(`Exporting ${tableName} as sheet: ${sheetName}`);
      
      if (Array.isArray(tableData) && tableData.length > 0) {
        hasData = true;
        
        // Clean data for export (remove internal fields)
        const cleanData = tableData.map(row => {
          const { id, created_at, updated_at, ...cleanRow } = row;
          return cleanRow;
        });
        
        const ws = XLSX.utils.json_to_sheet(cleanData);
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);
      } else {
        // Create empty sheet with headers
        const headers = REQUIRED_FIELDS[tableName] || [];
        const emptyRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
        const ws = XLSX.utils.json_to_sheet([emptyRow]);
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
      description: "Live dashboard data exported successfully."
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
