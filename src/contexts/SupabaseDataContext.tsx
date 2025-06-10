
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

  const importDataToSupabase = async (importedData: any) => {
    try {
      const operations: any[] = [];

      // Import General Info
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

      // Import Bookies Data
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

      // Import Risks
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

      // Import Milestones + Deliverables
      if (importedData['Milestones + Deliverables']) {
        operations.push(
          supabase.from('milestones').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Milestones + Deliverables'].map((item: any) =>
            supabase.from('milestones').insert({
              milestone: item.Milestone || item.milestone,
              phase: item.Phase || item.phase,
              due_date: item.Due_Date || item.due_date,
              status: item.Status || item.status,
              progress: item.Progress || item.progress || 0,
            })
          )
        );
      }

      // Import Action Log
      if (importedData['Action Log']) {
        operations.push(
          supabase.from('action_log').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Action Log'].map((item: any) =>
            supabase.from('action_log').insert({
              action_id: item.Action_ID || item.action_id,
              description: item.Description || item.description,
              owner: item.Owner || item.owner,
              due_date: item.Due_Date || item.due_date,
              status: item.Status || item.status,
              source: item.Source || item.source,
            })
          )
        );
      }

      // Import Material Procurement
      if (importedData['Material Procurement']) {
        operations.push(
          supabase.from('material_procurement').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Material Procurement'].map((item: any) =>
            supabase.from('material_procurement').insert({
              material_id: item.Material_ID || item.material_id,
              material_name: item.Material_Name || item.material_name,
              supplier: item.Supplier || item.supplier,
              initiation_date: item.Initiation_Date || item.initiation_date,
              required_date: item.Required_Date || item.required_date,
              lead_time_days: item.Lead_Time_Days || item.lead_time_days,
              status: item.Status || item.status,
            })
          )
        );
      }

      // Import Service Procurement
      if (importedData['Service Procurement']) {
        operations.push(
          supabase.from('service_procurement').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Service Procurement'].map((item: any) =>
            supabase.from('service_procurement').insert({
              service_id: item.Service_ID || item.service_id,
              service_name: item.Service_Name || item.service_name,
              provider: item.Provider || item.provider,
              initiation_date: item.Initiation_Date || item.initiation_date,
              required_date: item.Required_Date || item.required_date,
              lead_time_days: item.Lead_Time_Days || item.lead_time_days,
              status: item.Status || item.status,
            })
          )
        );
      }

      // Import Comments-Notes
      if (importedData['Comments-Notes']) {
        operations.push(
          supabase.from('comments_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Comments-Notes'].map((item: any) =>
            supabase.from('comments_notes').insert({
              comment: item.Comment || item.comment,
              author: item.Author || item.author,
              category: item.Category || item.category,
              date: item.Date || item.date,
            })
          )
        );
      }

      // Import Deliverables Status
      if (importedData['Deliverables Status']) {
        operations.push(
          supabase.from('deliverables_status').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ...importedData['Deliverables Status'].map((item: any) =>
            supabase.from('deliverables_status').insert({
              deliverable: item.Deliverable || item.deliverable,
              phase: item.Phase || item.phase,
              owner: item.Owner || item.owner,
              due_date: item.Due_Date || item.due_date,
              status: item.Status || item.status,
              progress: item.Progress || item.progress || 0,
            })
          )
        );
      }

      await Promise.all(operations);

      toast({
        title: 'Import Successful',
        description: 'All data has been imported to the database successfully',
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
    // Fetch initial data
    fetchAllData();

    // Set up realtime subscription - single subscription for the entire app
    const channel = supabase.channel('dashboard-changes');

    // Set up all listeners
    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'general_info' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookies_data' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'risks' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'milestones' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'action_log' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'material_procurement' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_procurement' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments_notes' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliverables_status' },
        () => fetchAllData()
      );

    // Subscribe to the channel
    channel.subscribe();

    // Cleanup function
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
