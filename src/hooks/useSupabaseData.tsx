
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseTableData {
  [key: string]: any[];
}

export const useSupabaseData = () => {
  const [data, setData] = useState<SupabaseTableData>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllData = async () => {
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
        deliverablesStatus
      ] = await Promise.all([
        supabase.from('general_info').select('*'),
        supabase.from('bookies_data').select('*'),
        supabase.from('risks').select('*'),
        supabase.from('milestones').select('*'),
        supabase.from('action_log').select('*'),
        supabase.from('material_procurement').select('*'),
        supabase.from('service_procurement').select('*'),
        supabase.from('comments_notes').select('*'),
        supabase.from('deliverables_status').select('*')
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
        'Deliverables Status': deliverablesStatus.data || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const importDataToSupabase = async (importedData: any) => {
    try {
      // Clear existing data and insert new data
      const operations = [];

      if (importedData['General Info']) {
        operations.push(
          supabase.from('general_info').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['General Info'].map((item: any) => 
            supabase.from('general_info').insert({
              field: item.Field || item.field,
              value: item.Value || item.value
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
              actual: item.Actual || item.actual
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
              mitigation: item.Mitigation || item.mitigation
            })
          )
        );
      }

      await Promise.all(operations);
      
      toast({
        title: "Import Successful",
        description: "Data has been imported to the database successfully"
      });
      
      // Refresh data
      fetchAllData();
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import data to database",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAllData();

    // Set up real-time subscriptions
    const channels = [
      supabase.channel('general_info_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'general_info' }, fetchAllData),
      supabase.channel('bookies_data_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'bookies_data' }, fetchAllData),
      supabase.channel('risks_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'risks' }, fetchAllData),
      supabase.channel('milestones_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, fetchAllData),
      supabase.channel('action_log_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'action_log' }, fetchAllData),
      supabase.channel('material_procurement_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'material_procurement' }, fetchAllData),
      supabase.channel('service_procurement_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'service_procurement' }, fetchAllData),
      supabase.channel('comments_notes_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'comments_notes' }, fetchAllData),
      supabase.channel('deliverables_status_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'deliverables_status' }, fetchAllData)
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  return { data, loading, fetchAllData, importDataToSupabase };
};
