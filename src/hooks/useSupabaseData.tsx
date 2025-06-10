import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/types';

export interface SupabaseTableData {
  [key: string]: any[];
}

export const useSupabaseData = () => {
  const [data, setData] = useState<SupabaseTableData>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        generalInfo,
        bookiesData,
        risks,
        milestones,
        actionLog,
        materialProcurement,
        serviceProcurement,
        commentsNotes,
        deliverablesStatus,
      ] = await Promise.all([
        supabase.from('general_info').select('*'),
        supabase.from('bookies_data').select('*'),
        supabase.from('risks').select('*'),
        supabase.from('milestones').select('*'),
        supabase.from('action_log').select('*'),
        supabase.from('material_procurement').select('*'),
        supabase.from('service_procurement').select('*'),
        supabase.from('comments_notes').select('*'),
        supabase.from('deliverables_status').select('*'),
      ]);

      setData({
        'General Info': generalInfo.data || [],
        'Bookies Data': bookiesData.data || [],
        'Risks': risks.data || [],
        'Milestones + Deliverables': milestones.data || [],
        'Action Log': actionLog.data || [],
        'Material Procurement': materialProcurement.data || [],
        'Service Procurement': serviceProcurement.data || [],
        'Comments-Notes': commentsNotes.data || [],
        'Deliverables Status': deliverablesStatus.data || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data from database',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const importDataToSupabase = async (importedData: any) => {
    try {
      const operations: any[] = [];

      // Define expected sheet names and their corresponding table mappings
      const tableMappings: { [key: string]: { table: string; onConflict: string; fields: string[] } } = {
        'General Info': {
          table: 'general_info',
          onConflict: 'field',
          fields: ['field', 'value'],
        },
        'Bookies Data': {
          table: 'bookies_data',
          onConflict: 'id',
          fields: ['area', 'target', 'actual'],
        },
        'Risks': {
          table: 'risks',
          onConflict: 'risk_id',
          fields: ['risk_id', 'risk_name', 'probability', 'impact', 'risk_score', 'mitigation'],
        },
        'Milestones + Deliverables': {
          table: 'milestones',
          onConflict: 'id',
          fields: ['milestone', 'phase', 'due_date', 'status', 'progress'],
        },
        'Action Log': {
          table: 'action_log',
          onConflict: 'action_id',
          fields: ['action_id', 'description', 'owner', 'due_date', 'status', 'source'],
        },
        'Material Procurement': {
          table: 'material_procurement',
          onConflict: 'material_id',
          fields: ['material_id', 'material_name', 'supplier', 'initiation_date', 'required_date', 'lead_time_days', 'status'],
        },
        'Service Procurement': {
          table: 'service_procurement',
          onConflict: 'service_id',
          fields: ['service_id', 'service_name', 'provider', 'initiation_date', 'required_date', 'lead_time_days', 'status'],
        },
        'Comments-Notes': {
          table: 'comments_notes',
          onConflict: 'id',
          fields: ['comment', 'author', 'category', 'date'],
        },
        'Deliverables Status': {
          table: 'deliverables_status',
          onConflict: 'id',
          fields: ['deliverable', 'phase', 'owner', 'due_date', 'status', 'progress'],
        },
      };

      // Validate and process each sheet
      for (const [sheetName, mapping] of Object.entries(tableMappings)) {
        if (importedData[sheetName]) {
          const rows = importedData[sheetName];
          const operationsForTable = rows.map((item: any) => {
            // Map Excel column names to database fields, handling case variations
            const upsertData: { [key: string]: any } = {};
            mapping.fields.forEach((field) => {
              const fieldVariations = [
                field,
                field.charAt(0).toUpperCase() + field.slice(1), // PascalCase
                field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), // camelCase
              ];
              for (const variation of fieldVariations) {
                if (item[variation] !== undefined) {
                  upsertData[field] = item[variation];
                  break;
                }
              }
            });

            // Ensure all required fields are present
            const missingFields = mapping.fields.filter((field) => upsertData[field] === undefined);
            if (missingFields.length > 0) {
              throw new Error(`Missing required fields in ${sheetName}: ${missingFields.join(', ')}`);
            }

            return supabase
              .from(mapping.table)
              .upsert(upsertData, { onConflict: mapping.onConflict });
          });

          operations.push(...operationsForTable);
        }
      }

      await Promise.all(operations);

      toast({
        title: 'Import Successful',
        description: 'Data has been imported to the database successfully',
      });

      await fetchAllData(); // Refresh data to update dashboard graphs
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: 'Import Failed',
        description: `Failed to import data to database: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Use a static channel name to avoid multiple subscriptions
    const channel = supabase.channel('dashboard-changes');

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'general_info' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookies_data' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'risks' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'action_log' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'material_procurement' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_procurement' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments_notes' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliverables_status' }, fetchAllData);

    channelRef.current = channel;
    channel.subscribe();

    // Initial data fetch
    fetchAllData();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchAllData]);

  return {
    data,
    loading,
    fetchAllData,
    importDataToSupabase,
  };
};
