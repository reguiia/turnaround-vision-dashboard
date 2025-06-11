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
      // Clear all existing data first - Execute the queries properly
      await Promise.all([
        supabase.from('general_info').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('bookies_data').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('risks').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('milestones').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('action_log').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('material_procurement').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('service_procurement').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('comments_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('deliverables_status').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      ]);

      // Now insert new data - properly execute the upsert operations
      const insertOperations: Promise<any>[] = [];

      // Insert General Info
      if (importedData['General Info'] && importedData['General Info'].length > 0) {
        const generalInfoData = importedData['General Info'].map((item: any) => ({
          field: item.Field || item.field,
          value: item.Value || item.value,
        }));
        insertOperations.push(supabase.from('general_info').upsert(generalInfoData).then(result => result));
      }

      // Insert Bookies Data
      if (importedData['Bookies Data'] && importedData['Bookies Data'].length > 0) {
        const bookiesData = importedData['Bookies Data'].map((item: any) => ({
          area: item.Area || item.area,
          target: item.Target || item.target,
          actual: item.Actual || item.actual,
        }));
        insertOperations.push(supabase.from('bookies_data').upsert(bookiesData).then(result => result));
      }

      // Insert Risks
      if (importedData['Risks'] && importedData['Risks'].length > 0) {
        const risksData = importedData['Risks'].map((item: any) => ({
          risk_id: item.Risk_ID || item.risk_id,
          risk_name: item.Risk_Name || item.risk_name,
          probability: item.Probability || item.probability,
          impact: item.Impact || item.impact,
          risk_score: item.Risk_Score || item.risk_score,
          mitigation: item.Mitigation || item.mitigation || null,
        }));
        insertOperations.push(supabase.from('risks').upsert(risksData).then(result => result));
      }

      // Insert Milestones
      if (importedData['Milestones + Deliverables'] && importedData['Milestones + Deliverables'].length > 0) {
        const milestonesData = importedData['Milestones + Deliverables'].map((item: any) => ({
          milestone: item.Milestone || item.milestone,
          phase: item.Phase || item.phase,
          due_date: item.Due_Date || item.due_date,
          status: item.Status || item.status,
          progress: item.Progress || item.progress || 0,
        }));
        insertOperations.push(supabase.from('milestones').upsert(milestonesData).then(result => result));
      }

      // Insert Action Log
      if (importedData['Action Log'] && importedData['Action Log'].length > 0) {
        const actionLogData = importedData['Action Log'].map((item: any) => ({
          action_id: item.Action_ID || item.action_id,
          description: item.Description || item.description,
          owner: item.Owner || item.owner,
          due_date: item.Due_Date || item.due_date,
          status: item.Status || item.status,
          source: item.Source || item.source,
        }));
        insertOperations.push(supabase.from('action_log').upsert(actionLogData).then(result => result));
      }

      // Insert Material Procurement
      if (importedData['Material Procurement'] && importedData['Material Procurement'].length > 0) {
        const materialData = importedData['Material Procurement'].map((item: any) => ({
          material_id: item.Material_ID || item.material_id,
          material_name: item.Material_Name || item.material_name,
          supplier: item.Supplier || item.supplier,
          initiation_date: item.Initiation_Date || item.initiation_date,
          required_date: item.Required_Date || item.required_date,
          lead_time_days: item.Lead_Time_Days || item.lead_time_days,
          status: item.Status || item.status,
        }));
        insertOperations.push(supabase.from('material_procurement').upsert(materialData).then(result => result));
      }

      // Insert Service Procurement
      if (importedData['Service Procurement'] && importedData['Service Procurement'].length > 0) {
        const serviceData = importedData['Service Procurement'].map((item: any) => ({
          service_id: item.Service_ID || item.service_id,
          service_name: item.Service_Name || item.service_name,
          provider: item.Provider || item.provider,
          initiation_date: item.Initiation_Date || item.initiation_date,
          required_date: item.Required_Date || item.required_date,
          lead_time_days: item.Lead_Time_Days || item.lead_time_days,
          status: item.Status || item.status,
        }));
        insertOperations.push(supabase.from('service_procurement').upsert(serviceData).then(result => result));
      }

      // Insert Comments-Notes
      if (importedData['Comments-Notes'] && importedData['Comments-Notes'].length > 0) {
        const commentsData = importedData['Comments-Notes'].map((item: any) => ({
          comment: item.Comment || item.comment,
          author: item.Author || item.author,
          category: item.Category || item.category,
          date: item.Date || item.date,
        }));
        insertOperations.push(supabase.from('comments_notes').upsert(commentsData).then(result => result));
      }

      // Insert Deliverables Status
      if (importedData['Deliverables Status'] && importedData['Deliverables Status'].length > 0) {
        const deliverablesData = importedData['Deliverables Status'].map((item: any) => ({
          deliverable: item.Deliverable || item.deliverable,
          phase: item.Phase || item.phase,
          owner: item.Owner || item.owner,
          due_date: item.Due_Date || item.due_date,
          status: item.Status || item.status,
          progress: item.Progress || item.progress || 0,
        }));
        insertOperations.push(supabase.from('deliverables_status').upsert(deliverablesData).then(result => result));
      }

      // Execute all insertions
      await Promise.all(insertOperations);

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

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channelName = `dashboard-changes-${Date.now()}-${Math.random()}`;
    const channel = supabase.channel(channelName);

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

    fetchAllData();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
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
