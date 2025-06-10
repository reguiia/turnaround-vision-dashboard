import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseTableData {
  [key: string]: any[];
}

interface SupabaseDataContextType {
  data: SupabaseTableData;
  loading: boolean;
  fetchAllData: () => Promise<void>;
  importDataToSupabase: (importedData: any) => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const SupabaseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const importDataToSupabase = useCallback(async (importedData: any) => {
    try {
      const operations: Promise<any>[] = [];

      const processTable = (tableName: string, data: any[], idField: string, transformFn: (item: any) => any) => {
        if (!data || data.length === 0) return;
        
        operations.push(
          supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000')
        );
        
        operations.push(
          supabase.from(tableName).upsert(
            data.map(item => transformFn(item)),
            { onConflict: idField }
          )
        );
      };

      // Process all tables
      processTable(
        'general_info',
        importedData['General Info'] || [],
        'field',
        (item) => ({
          field: item.Field || item.field,
          value: item.Value || item.value,
        })
      );

      processTable(
        'bookies_data',
        importedData['Bookies Data'] || [],
        'id',
        (item) => ({
          area: item.Area || item.area,
          target: item.Target || item.target,
          actual: item.Actual || item.actual,
        })
      );

      processTable(
        'risks',
        importedData['Risks'] || [],
        'risk_id',
        (item) => ({
          risk_id: item.Risk_ID || item.risk_id,
          risk_name: item.Risk_Name || item.risk_name,
          probability: item.Probability || item.probability,
          impact: item.Impact || item.impact,
          risk_score: item.Risk_Score || item.risk_score,
          mitigation: item.Mitigation || item.mitigation || null,
        })
      );

      processTable(
        'milestones',
        importedData['Milestones + Deliverables'] || [],
        'id',
        (item) => ({
          milestone: item.Milestone || item.milestone,
          phase: item.Phase || item.phase,
          due_date: item.Due_Date || item.due_date,
          status: item.Status || item.status,
          progress: item.Progress || item.progress || 0,
        })
      );

      processTable(
        'action_log',
        importedData['Action Log'] || [],
        'action_id',
        (item) => ({
          action_id: item.Action_ID || item.action_id,
          description: item.Description || item.description,
          owner: item.Owner || item.owner,
          due_date: item.Due_Date || item.due_date,
          status: item.Status || item.status,
          source: item.Source || item.source,
        })
      );

      processTable(
        'material_procurement',
        importedData['Material Procurement'] || [],
        'material_id',
        (item) => ({
          material_id: item.Material_ID || item.material_id,
          material_name: item.Material_Name || item.material_name,
          supplier: item.Supplier || item.supplier,
          initiation_date: item.Initiation_Date || item.initiation_date,
          required_date: item.Required_Date || item.required_date,
          lead_time_days: item.Lead_Time_Days || item.lead_time_days,
          status: item.Status || item.status,
        })
      );

      processTable(
        'service_procurement',
        importedData['Service Procurement'] || [],
        'service_id',
        (item) => ({
          service_id: item.Service_ID || item.service_id,
          service_name: item.Service_Name || item.service_name,
          provider: item.Provider || item.provider,
          initiation_date: item.Initiation_Date || item.initiation_date,
          required_date: item.Required_Date || item.required_date,
          lead_time_days: item.Lead_Time_Days || item.lead_time_days,
          status: item.Status || item.status,
        })
      );

      processTable(
        'comments_notes',
        importedData['Comments-Notes'] || [],
        'id',
        (item) => ({
          comment: item.Comment || item.comment,
          author: item.Author || item.author,
          category: item.Category || item.category,
          date: item.Date || item.date,
        })
      );

      processTable(
        'deliverables_status',
        importedData['Deliverables Status'] || [],
        'id',
        (item) => ({
          deliverable: item.Deliverable || item.deliverable,
          phase: item.Phase || item.phase,
          owner: item.Owner || item.owner,
          due_date: item.Due_Date || item.due_date,
          status: item.Status || item.status,
          progress: item.Progress || item.progress || 0,
        })
      );

      await Promise.all(operations);

      toast({
        title: 'Import Successful',
        description: 'All data has been imported to the database successfully',
      });

      fetchAllData();
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: 'Import Failed',
        description: 'Failed to import data to database',
        variant: 'destructive',
      });
    }
  }, [fetchAllData, toast]);

  useEffect(() => {
    fetchAllData();

    const channel = supabase.channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'general_info' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookies_data' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'risks' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'action_log' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'material_procurement' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_procurement' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments_notes' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliverables_status' }, fetchAllData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllData]);

  return (
    <SupabaseDataContext.Provider value={{ data, loading, fetchAllData, importDataToSupabase }}>
      {children}
    </SupabaseDataContext.Provider>
  );
};

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext);
  if (context === undefined) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
  }
  return context;
};
