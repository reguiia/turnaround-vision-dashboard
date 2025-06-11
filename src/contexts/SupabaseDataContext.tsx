
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

export interface SupabaseTableData {
  [key: string]: any[];
}

interface SupabaseDataContextType {
  data: SupabaseTableData;
  loading: boolean;
  fetchAllData: () => Promise<void>;
  importDataToSupabase: (importedData: any) => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(
  undefined,
);

export const SupabaseDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
        supabase.from("general_info").select("*"),
        supabase.from("bookies_data").select("*"),
        supabase.from("risks").select("*"),
        supabase.from("milestones").select("*"),
        supabase.from("action_log").select("*"),
        supabase.from("material_procurement").select("*"),
        supabase.from("service_procurement").select("*"),
        supabase.from("comments_notes").select("*"),
        supabase.from("deliverables_status").select("*"),
      ]);

      setData({
        "General Info": generalInfo.data || [],
        "Bookies Data": bookiesData.data || [],
        Risks: risks.data || [],
        "Milestones + Deliverables": milestones.data || [],
        "Action Log": actionLog.data || [],
        "Material Procurement": materialProcurement.data || [],
        "Service Procurement": serviceProcurement.data || [],
        "Comments-Notes": commentsNotes.data || [],
        "Deliverables Status": deliverablesStatus.data || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const importDataToSupabase = async (importedData: any) => {
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Define table mappings with proper upsert logic
      const tableMappings = {
        "General Info": {
          table: "general_info",
          uniqueField: "field",
          transform: (item: any) => ({
            field: item.Field || item.field || "",
            value: item.Value || item.value || "",
          }),
        },
        "Bookies Data": {
          table: "bookies_data",
          uniqueField: "area",
          transform: (item: any) => ({
            area: item.Area || item.area || "",
            target: Number(item.Target || item.target || 0),
            actual: Number(item.Actual || item.actual || 0),
          }),
        },
        Risks: {
          table: "risks",
          uniqueField: "risk_id",
          transform: (item: any) => ({
            risk_id: item.Risk_ID || item.risk_id || "",
            risk_name: item.Risk_Name || item.risk_name || "",
            probability: Number(item.Probability || item.probability || 0),
            impact: Number(item.Impact || item.impact || 0),
            risk_score: Number(item.Risk_Score || item.risk_score || 0),
            mitigation: item.Mitigation || item.mitigation || null,
          }),
        },
        "Milestones + Deliverables": {
          table: "milestones",
          uniqueField: "milestone",
          transform: (item: any) => ({
            milestone: item.Milestone || item.milestone || "",
            phase: item.Phase || item.phase || "",
            due_date: item.Due_Date || item.due_date || "",
            status: item.Status || item.status || "",
            progress: Number(item.Progress || item.progress || 0),
          }),
        },
        "Action Log": {
          table: "action_log",
          uniqueField: "action_id",
          transform: (item: any) => ({
            action_id: item.Action_ID || item.action_id || "",
            description: item.Description || item.description || "",
            owner: item.Owner || item.owner || "",
            due_date: item.Due_Date || item.due_date || "",
            status: item.Status || item.status || "",
            source: item.Source || item.source || "",
          }),
        },
        "Material Procurement": {
          table: "material_procurement",
          uniqueField: "material_id",
          transform: (item: any) => ({
            material_id: item.Material_ID || item.material_id || "",
            material_name: item.Material_Name || item.material_name || "",
            supplier: item.Supplier || item.supplier || "",
            initiation_date: item.Initiation_Date || item.initiation_date || "",
            required_date: item.Required_Date || item.required_date || "",
            lead_time_days: Number(item.Lead_Time_Days || item.lead_time_days || 0),
            status: item.Status || item.status || "",
          }),
        },
        "Service Procurement": {
          table: "service_procurement",
          uniqueField: "service_id",
          transform: (item: any) => ({
            service_id: item.Service_ID || item.service_id || "",
            service_name: item.Service_Name || item.service_name || "",
            provider: item.Provider || item.provider || "",
            initiation_date: item.Initiation_Date || item.initiation_date || "",
            required_date: item.Required_Date || item.required_date || "",
            lead_time_days: Number(item.Lead_Time_Days || item.lead_time_days || 0),
            status: item.Status || item.status || "",
          }),
        },
        "Comments-Notes": {
          table: "comments_notes",
          uniqueField: "comment",
          transform: (item: any) => ({
            comment: item.Comment || item.comment || "",
            author: item.Author || item.author || "",
            category: item.Category || item.category || "",
            date: item.Date || item.date || "",
          }),
        },
        "Deliverables Status": {
          table: "deliverables_status",
          uniqueField: "deliverable",
          transform: (item: any) => ({
            deliverable: item.Deliverable || item.deliverable || "",
            phase: item.Phase || item.phase || "",
            owner: item.Owner || item.owner || "",
            due_date: item.Due_Date || item.due_date || "",
            status: item.Status || item.status || "",
            progress: Number(item.Progress || item.progress || 0),
          }),
        },
      };

      // Process each sheet
      for (const [sheetName, mapping] of Object.entries(tableMappings)) {
        if (importedData[sheetName] && Array.isArray(importedData[sheetName])) {
          const rows = importedData[sheetName];
          console.log(`Processing ${sheetName} with ${rows.length} rows`);

          for (const item of rows) {
            try {
              const transformedData = mapping.transform(item);
              
              // Skip rows with empty unique identifiers
              if (!transformedData[mapping.uniqueField] || transformedData[mapping.uniqueField].toString().trim() === "") {
                console.log(`Skipping row with empty ${mapping.uniqueField} in ${sheetName}`);
                continue;
              }

              // Check if record exists
              const { data: existingRecord } = await supabase
                .from(mapping.table)
                .select("id")
                .eq(mapping.uniqueField, transformedData[mapping.uniqueField])
                .maybeSingle();

              if (existingRecord) {
                // Update existing record
                const { error } = await supabase
                  .from(mapping.table)
                  .update(transformedData)
                  .eq("id", existingRecord.id);

                if (error) {
                  errors.push(`Error updating ${sheetName}: ${error.message}`);
                  errorCount++;
                  console.error(`Update error in ${sheetName}:`, error);
                } else {
                  successCount++;
                  console.log(`Updated record in ${sheetName}:`, transformedData[mapping.uniqueField]);
                }
              } else {
                // Insert new record
                const { error } = await supabase
                  .from(mapping.table)
                  .insert(transformedData);

                if (error) {
                  errors.push(`Error inserting ${sheetName}: ${error.message}`);
                  errorCount++;
                  console.error(`Insert error in ${sheetName}:`, error);
                } else {
                  successCount++;
                  console.log(`Inserted new record in ${sheetName}:`, transformedData[mapping.uniqueField]);
                }
              }
            } catch (rowError) {
              console.error(`Error processing row in ${sheetName}:`, rowError);
              errors.push(`Error in ${sheetName}: ${rowError.message || "Unknown error"}`);
              errorCount++;
            }
          }
        }
      }

      // Show results
      if (errorCount === 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported/updated ${successCount} records`,
        });
      } else if (successCount > 0) {
        toast({
          title: "Import Partially Successful",
          description: `${successCount} records imported/updated, ${errorCount} failed. Check console for details.`,
          variant: "default",
        });
        console.warn("Import errors:", errors);
      } else {
        toast({
          title: "Import Failed",
          description: `All ${errorCount} records failed to import. Check console for details.`,
          variant: "destructive",
        });
        console.error("Import errors:", errors);
      }

      // Refresh data to update dashboard graphs
      await fetchAllData();
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import Failed",
        description: `Failed to import data to database: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchAllData();

    // Set up realtime subscription with a unique static channel name
    const channelName = "dashboard-realtime-updates";
    let channel = supabase.getChannels().find((ch) => ch.topic === channelName);

    // If channel already exists, remove it first to prevent duplicates
    if (channel) {
      supabase.removeChannel(channel);
    }

    // Create new channel
    channel = supabase.channel(channelName);

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "general_info" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookies_data" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "risks" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "milestones" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "action_log" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "material_procurement" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "service_procurement" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments_notes" },
        () => fetchAllData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deliverables_status" },
        () => fetchAllData(),
      );

    channel.subscribe();

    // Cleanup function
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []); // Remove fetchAllData from dependency array to prevent re-subscriptions

  return (
    <SupabaseDataContext.Provider
      value={{ data, loading, fetchAllData, importDataToSupabase }}
    >
      {children}
    </SupabaseDataContext.Provider>
  );
};

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseData must be used within a SupabaseDataProvider",
    );
  }
  return context;
};
