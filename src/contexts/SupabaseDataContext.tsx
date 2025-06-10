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

      // Define expected sheet names and their corresponding table mappings
      const tableMappings: {
        [key: string]: {
          table: string;
          identifierField: string;
          fields: string[];
          fieldMappings: { [key: string]: string[] };
        };
      } = {
        "General Info": {
          table: "general_info",
          identifierField: "field",
          fields: ["field", "value"],
          fieldMappings: {
            field: ["field", "Field", "FIELD"],
            value: ["value", "Value", "VALUE"],
          },
        },
        "Bookies Data": {
          table: "bookies_data",
          identifierField: "area",
          fields: ["area", "target", "actual"],
          fieldMappings: {
            area: ["area", "Area", "AREA"],
            target: ["target", "Target", "TARGET"],
            actual: ["actual", "Actual", "ACTUAL"],
          },
        },
        Risks: {
          table: "risks",
          identifierField: "risk_id",
          fields: [
            "risk_id",
            "risk_name",
            "probability",
            "impact",
            "risk_score",
            "mitigation",
          ],
          fieldMappings: {
            risk_id: ["risk_id", "Risk ID", "Risk_ID", "RiskID", "RISK_ID"],
            risk_name: [
              "risk_name",
              "Risk Name",
              "Risk_Name",
              "RiskName",
              "RISK_NAME",
            ],
            probability: ["probability", "Probability", "PROBABILITY"],
            impact: ["impact", "Impact", "IMPACT"],
            risk_score: [
              "risk_score",
              "Risk Score",
              "Risk_Score",
              "RiskScore",
              "RISK_SCORE",
            ],
            mitigation: ["mitigation", "Mitigation", "MITIGATION"],
          },
        },
        "Milestones + Deliverables": {
          table: "milestones",
          identifierField: "milestone",
          fields: ["milestone", "phase", "due_date", "status", "progress"],
          fieldMappings: {
            milestone: ["milestone", "Milestone", "MILESTONE"],
            phase: ["phase", "Phase", "PHASE"],
            due_date: [
              "due_date",
              "Due Date",
              "Due_Date",
              "DueDate",
              "DUE_DATE",
            ],
            status: ["status", "Status", "STATUS"],
            progress: ["progress", "Progress", "PROGRESS"],
          },
        },
        "Action Log": {
          table: "action_log",
          identifierField: "action_id",
          fields: [
            "action_id",
            "description",
            "owner",
            "due_date",
            "status",
            "source",
          ],
          fieldMappings: {
            action_id: [
              "action_id",
              "Action ID",
              "Action_ID",
              "ActionID",
              "ACTION_ID",
            ],
            description: ["description", "Description", "DESCRIPTION"],
            owner: ["owner", "Owner", "OWNER"],
            due_date: [
              "due_date",
              "Due Date",
              "Due_Date",
              "DueDate",
              "DUE_DATE",
            ],
            status: ["status", "Status", "STATUS"],
            source: ["source", "Source", "SOURCE"],
          },
        },
        "Material Procurement": {
          table: "material_procurement",
          identifierField: "material_id",
          fields: [
            "material_id",
            "material_name",
            "supplier",
            "initiation_date",
            "required_date",
            "lead_time_days",
            "status",
          ],
          fieldMappings: {
            material_id: [
              "material_id",
              "Material ID",
              "Material_ID",
              "MaterialID",
              "MATERIAL_ID",
            ],
            material_name: [
              "material_name",
              "Material Name",
              "Material_Name",
              "MaterialName",
              "MATERIAL_NAME",
            ],
            supplier: ["supplier", "Supplier", "SUPPLIER"],
            initiation_date: [
              "initiation_date",
              "Initiation Date",
              "Initiation_Date",
              "InitiationDate",
              "INITIATION_DATE",
            ],
            required_date: [
              "required_date",
              "Required Date",
              "Required_Date",
              "RequiredDate",
              "REQUIRED_DATE",
            ],
            lead_time_days: [
              "lead_time_days",
              "Lead Time Days",
              "Lead_Time_Days",
              "LeadTimeDays",
              "LEAD_TIME_DAYS",
            ],
            status: ["status", "Status", "STATUS"],
          },
        },
        "Service Procurement": {
          table: "service_procurement",
          identifierField: "service_id",
          fields: [
            "service_id",
            "service_name",
            "provider",
            "initiation_date",
            "required_date",
            "lead_time_days",
            "status",
          ],
          fieldMappings: {
            service_id: [
              "service_id",
              "Service ID",
              "Service_ID",
              "ServiceID",
              "SERVICE_ID",
            ],
            service_name: [
              "service_name",
              "Service Name",
              "Service_Name",
              "ServiceName",
              "SERVICE_NAME",
            ],
            provider: ["provider", "Provider", "PROVIDER"],
            initiation_date: [
              "initiation_date",
              "Initiation Date",
              "Initiation_Date",
              "InitiationDate",
              "INITIATION_DATE",
            ],
            required_date: [
              "required_date",
              "Required Date",
              "Required_Date",
              "RequiredDate",
              "REQUIRED_DATE",
            ],
            lead_time_days: [
              "lead_time_days",
              "Lead Time Days",
              "Lead_Time_Days",
              "LeadTimeDays",
              "LEAD_TIME_DAYS",
            ],
            status: ["status", "Status", "STATUS"],
          },
        },
        "Comments-Notes": {
          table: "comments_notes",
          identifierField: "comment",
          fields: ["comment", "author", "category", "date"],
          fieldMappings: {
            comment: ["comment", "Comment", "COMMENT"],
            author: ["author", "Author", "AUTHOR"],
            category: ["category", "Category", "CATEGORY"],
            date: ["date", "Date", "DATE"],
          },
        },
        "Deliverables Status": {
          table: "deliverables_status",
          identifierField: "deliverable",
          fields: [
            "deliverable",
            "phase",
            "owner",
            "due_date",
            "status",
            "progress",
          ],
          fieldMappings: {
            deliverable: ["deliverable", "Deliverable", "DELIVERABLE"],
            phase: ["phase", "Phase", "PHASE"],
            owner: ["owner", "Owner", "OWNER"],
            due_date: [
              "due_date",
              "Due Date",
              "Due_Date",
              "DueDate",
              "DUE_DATE",
            ],
            status: ["status", "Status", "STATUS"],
            progress: ["progress", "Progress", "PROGRESS"],
          },
        },
      };

      // Process each sheet
      for (const [sheetName, mapping] of Object.entries(tableMappings)) {
        if (importedData[sheetName] && Array.isArray(importedData[sheetName])) {
          const rows = importedData[sheetName];
          console.log(`Processing ${sheetName} with ${rows.length} rows`);

          for (const item of rows) {
            try {
              // Map Excel column names to database fields
              const upsertData: { [key: string]: any } = {};

              for (const [dbField, excelVariations] of Object.entries(
                mapping.fieldMappings,
              )) {
                let value = undefined;

                // Try each variation until we find a match
                for (const variation of excelVariations) {
                  if (
                    item[variation] !== undefined &&
                    item[variation] !== null &&
                    item[variation] !== ""
                  ) {
                    value = item[variation];
                    break;
                  }
                }

                if (value !== undefined) {
                  // Convert numeric fields appropriately
                  if (
                    [
                      "target",
                      "actual",
                      "probability",
                      "impact",
                      "risk_score",
                      "progress",
                      "lead_time_days",
                    ].includes(dbField)
                  ) {
                    upsertData[dbField] = Number(value) || 0;
                  } else {
                    upsertData[dbField] = String(value).trim();
                  }
                }
              }

              // Check if we have the identifier field
              if (!upsertData[mapping.identifierField]) {
                errors.push(
                  `Missing identifier field '${mapping.identifierField}' in ${sheetName}`,
                );
                errorCount++;
                continue;
              }

              // First, try to find existing record
              const identifierValue = upsertData[mapping.identifierField];
              const { data: existingRecord } = await supabase
                .from(mapping.table)
                .select("id")
                .eq(mapping.identifierField, identifierValue)
                .maybeSingle();

              if (existingRecord) {
                // Update existing record
                const { error } = await supabase
                  .from(mapping.table)
                  .update(upsertData)
                  .eq("id", existingRecord.id);

                if (error) {
                  errors.push(`Error updating ${sheetName}: ${error.message}`);
                  errorCount++;
                } else {
                  successCount++;
                }
              } else {
                // Insert new record
                const { error } = await supabase
                  .from(mapping.table)
                  .insert(upsertData);

                if (error) {
                  errors.push(`Error inserting ${sheetName}: ${error.message}`);
                  errorCount++;
                } else {
                  successCount++;
                }
              }
            } catch (rowError) {
              console.error(`Error processing row in ${sheetName}:`, rowError);
              errors.push(
                `Error in ${sheetName}: ${rowError.message || "Unknown error"}`,
              );
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
