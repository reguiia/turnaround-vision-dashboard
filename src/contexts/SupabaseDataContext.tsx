
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      // Helper function to process general_info table
      const processGeneralInfo = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const field = item.Field || item.field || "";
            const value = item.Value || item.value || "";
            
            if (!field.trim()) continue;

            const { data: existing } = await supabase
              .from("general_info")
              .select("id")
              .eq("field", field)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("general_info")
                .update({ field, value })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating general_info: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("general_info")
                .insert({ field, value });
              
              if (error) {
                errors.push(`Error inserting general_info: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in general_info: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process bookies_data table
      const processBookiesData = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const area = item.Area || item.area || "";
            const target = Number(item.Target || item.target || 0);
            const actual = Number(item.Actual || item.actual || 0);
            
            if (!area.trim()) continue;

            const { data: existing } = await supabase
              .from("bookies_data")
              .select("id")
              .eq("area", area)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("bookies_data")
                .update({ area, target, actual })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating bookies_data: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("bookies_data")
                .insert({ area, target, actual });
              
              if (error) {
                errors.push(`Error inserting bookies_data: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in bookies_data: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process risks table
      const processRisks = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const risk_id = item.Risk_ID || item.risk_id || "";
            const risk_name = item.Risk_Name || item.risk_name || "";
            const probability = Number(item.Probability || item.probability || 0);
            const impact = Number(item.Impact || item.impact || 0);
            const risk_score = Number(item.Risk_Score || item.risk_score || 0);
            const mitigation = item.Mitigation || item.mitigation || null;
            
            if (!risk_id.trim()) continue;

            const { data: existing } = await supabase
              .from("risks")
              .select("id")
              .eq("risk_id", risk_id)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("risks")
                .update({ risk_id, risk_name, probability, impact, risk_score, mitigation })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating risks: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("risks")
                .insert({ risk_id, risk_name, probability, impact, risk_score, mitigation });
              
              if (error) {
                errors.push(`Error inserting risks: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in risks: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process milestones table
      const processMilestones = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const milestone = item.Milestone || item.milestone || "";
            const phase = item.Phase || item.phase || "";
            const due_date = item.Due_Date || item.due_date || "";
            const status = item.Status || item.status || "";
            const progress = Number(item.Progress || item.progress || 0);
            
            if (!milestone.trim()) continue;

            const { data: existing } = await supabase
              .from("milestones")
              .select("id")
              .eq("milestone", milestone)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("milestones")
                .update({ milestone, phase, due_date, status, progress })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating milestones: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("milestones")
                .insert({ milestone, phase, due_date, status, progress });
              
              if (error) {
                errors.push(`Error inserting milestones: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in milestones: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process action_log table
      const processActionLog = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const action_id = item.Action_ID || item.action_id || "";
            const description = item.Description || item.description || "";
            const owner = item.Owner || item.owner || "";
            const due_date = item.Due_Date || item.due_date || "";
            const status = item.Status || item.status || "";
            const source = item.Source || item.source || "";
            
            if (!action_id.trim()) continue;

            const { data: existing } = await supabase
              .from("action_log")
              .select("id")
              .eq("action_id", action_id)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("action_log")
                .update({ action_id, description, owner, due_date, status, source })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating action_log: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("action_log")
                .insert({ action_id, description, owner, due_date, status, source });
              
              if (error) {
                errors.push(`Error inserting action_log: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in action_log: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process material_procurement table
      const processMaterialProcurement = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const material_id = item.Material_ID || item.material_id || "";
            const material_name = item.Material_Name || item.material_name || "";
            const supplier = item.Supplier || item.supplier || "";
            const initiation_date = item.Initiation_Date || item.initiation_date || "";
            const required_date = item.Required_Date || item.required_date || "";
            const lead_time_days = Number(item.Lead_Time_Days || item.lead_time_days || 0);
            const status = item.Status || item.status || "";
            
            if (!material_id.trim()) continue;

            const { data: existing } = await supabase
              .from("material_procurement")
              .select("id")
              .eq("material_id", material_id)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("material_procurement")
                .update({ material_id, material_name, supplier, initiation_date, required_date, lead_time_days, status })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating material_procurement: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("material_procurement")
                .insert({ material_id, material_name, supplier, initiation_date, required_date, lead_time_days, status });
              
              if (error) {
                errors.push(`Error inserting material_procurement: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in material_procurement: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process service_procurement table
      const processServiceProcurement = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const service_id = item.Service_ID || item.service_id || "";
            const service_name = item.Service_Name || item.service_name || "";
            const provider = item.Provider || item.provider || "";
            const initiation_date = item.Initiation_Date || item.initiation_date || "";
            const required_date = item.Required_Date || item.required_date || "";
            const lead_time_days = Number(item.Lead_Time_Days || item.lead_time_days || 0);
            const status = item.Status || item.status || "";
            
            if (!service_id.trim()) continue;

            const { data: existing } = await supabase
              .from("service_procurement")
              .select("id")
              .eq("service_id", service_id)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("service_procurement")
                .update({ service_id, service_name, provider, initiation_date, required_date, lead_time_days, status })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating service_procurement: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("service_procurement")
                .insert({ service_id, service_name, provider, initiation_date, required_date, lead_time_days, status });
              
              if (error) {
                errors.push(`Error inserting service_procurement: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in service_procurement: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process comments_notes table
      const processCommentsNotes = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const comment = item.Comment || item.comment || "";
            const author = item.Author || item.author || "";
            const category = item.Category || item.category || "";
            const date = item.Date || item.date || "";
            
            if (!comment.trim()) continue;

            const { data: existing } = await supabase
              .from("comments_notes")
              .select("id")
              .eq("comment", comment)
              .eq("author", author)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("comments_notes")
                .update({ comment, author, category, date })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating comments_notes: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("comments_notes")
                .insert({ comment, author, category, date });
              
              if (error) {
                errors.push(`Error inserting comments_notes: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in comments_notes: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Helper function to process deliverables_status table
      const processDeliverablesStatus = async (items: any[]) => {
        if (!items || items.length === 0) return;
        
        for (const item of items) {
          try {
            const deliverable = item.Deliverable || item.deliverable || "";
            const phase = item.Phase || item.phase || "";
            const owner = item.Owner || item.owner || "";
            const due_date = item.Due_Date || item.due_date || "";
            const status = item.Status || item.status || "";
            const progress = Number(item.Progress || item.progress || 0);
            
            if (!deliverable.trim()) continue;

            const { data: existing } = await supabase
              .from("deliverables_status")
              .select("id")
              .eq("deliverable", deliverable)
              .maybeSingle();

            if (existing) {
              const { error } = await supabase
                .from("deliverables_status")
                .update({ deliverable, phase, owner, due_date, status, progress })
                .eq("id", existing.id);
              
              if (error) {
                errors.push(`Error updating deliverables_status: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            } else {
              const { error } = await supabase
                .from("deliverables_status")
                .insert({ deliverable, phase, owner, due_date, status, progress });
              
              if (error) {
                errors.push(`Error inserting deliverables_status: ${error.message}`);
                errorCount++;
              } else {
                successCount++;
              }
            }
          } catch (rowError: any) {
            errors.push(`Error in deliverables_status: ${rowError.message || "Unknown error"}`);
            errorCount++;
          }
        }
      };

      // Process each sheet with explicit function calls
      await processGeneralInfo(importedData['General Info']);
      await processBookiesData(importedData['Bookies Data']);
      await processRisks(importedData['Risks']);
      await processMilestones(importedData['Milestones + Deliverables']);
      await processActionLog(importedData['Action Log']);
      await processMaterialProcurement(importedData['Material Procurement']);
      await processServiceProcurement(importedData['Service Procurement']);
      await processCommentsNotes(importedData['Comments-Notes']);
      await processDeliverablesStatus(importedData['Deliverables Status']);

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
    } catch (error: any) {
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
