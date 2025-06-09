
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseTableData {
  [key: string]: any[];
}

export const useSupabaseData = () => {
  const [data, setData] = useState<SupabaseTableData>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

      if (importedData['General Info']) {
        operations.push(
          supabase.from('general_info').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['General Info'].map((item: any) =>
            supabase.from('general_info').insert({
              field: item.Field || item.field,
              value: item.Value || item.value,
            })
          )
        );
      }

      if (importedData['Bookies Data']) {
        operations.push(
          supabase.from('bookies_data').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Bookies Data'].map((item: any) =>
            supabase.from('bookies_data').insert({
              area: item.Area || item.area,
              target: item.Target || item.target,
              actual: item.Actual || item.actual,
            })
          )
        );
      }

      if (importedData['Risks']) {
        operations.push(
          supabase.from('risks').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Risks'].map((item: any) =>
            supabase.from('risks').insert({
              risk_id: item.Risk_ID || item.risk_id,
              risk_name: item.Risk_Name || item.risk_name,
              probability: item.Probability || item.probability,
              impact: item.Impact || item.impact,
              risk_score: item.Risk_Score || item.risk_score,
              mitigation: item.Mitigation || item.mitigation,
            })
          )
        );
      }

      await Promise.all(operations);

      toast({
        title: 'Import Successful',
        description: 'Data has been imported to the database successfully',
      });

      fetchAllData(); // Refresh after import
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: 'Import Failed',
        description: 'Failed to import data to database',
        variant: 'destructive',
      });
    }
  };

  // 👇 Use ref to track whether we've already subscribed
  const hasSubscribed = useRef(false);

  useEffect(() => {
    if (hasSubscribed.current) return;

    const channel = supabase.channel('dashboard-changes');

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'general_info' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookies_data' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'risks' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'milestones' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'action_log' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'material_procurement' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_procurement' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments_notes' },
        fetchAllData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliverables_status' },
        fetchAllData
      );

    fetchAllData();
    channel.subscribe();
    hasSubscribed.current = true;

    return () => {
      supabase.removeChannel(channel);
      hasSubscribed.current = false;
    };
  }, [fetchAllData]);

  return {
    data,
    loading,
    fetchAllData,
    importDataToSupabase,
  };
};
