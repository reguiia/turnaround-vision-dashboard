// This hook is deprecated - use SupabaseDataContext instead
// Keeping for backward compatibility but removing subscription logic
import { useSupabaseData as useContextData } from "@/contexts/SupabaseDataContext";

export interface SupabaseTableData {
  [key: string]: any[];
}

export const useSupabaseData = () => {
  // Simply delegate to the context to avoid duplicate subscriptions
  return useContextData();
};
