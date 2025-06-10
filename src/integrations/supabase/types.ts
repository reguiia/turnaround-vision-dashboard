export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
export type Database = {
  public: {
    Tables: {
      action_log: {
        Row: {
          action_id: string
          created_at: string
          description: string
          due_date: string
          id: string
          owner: string
          source: string
          status: string
          updated_at: string
        }
        upsert: {
          action_id: string
          created_at?: string
          description: string
          due_date: string
          id?: string
          owner: string
          source: string
          status: string
          updated_at?: string
        }
        Update: {
          action_id?: string
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          owner?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
        onConflict: 'action_id'
        ignoreDuplicates: false,
        columns: ['action_id', 'source', 'description', 'status', 'due_date', 'owner']
      }
      bookies_data: {
        Row: {
          actual: number
          area: string
          created_at: string
          id: string
          target: number
          updated_at: string
        }
        upsert: {
          actual: number
          area: string
          created_at?: string
          id?: string
          target: number
          updated_at?: string
        }
        Update: {
          actual?: number
          area?: string
          created_at?: string
          id?: string
          target?: number
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
      comments_notes: {
        Row: {
          author: string
          category: string
          comment: string
          created_at: string
          date: string
          id: string
          updated_at: string
        }
        upsert: {
          author: string
          category: string
          comment: string
          created_at?: string
          date: string
          id?: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          comment?: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
      deliverables_status: {
        Row: {
          created_at: string
          deliverable: string
          due_date: string
          id: string
          owner: string
          phase: string
          progress: number
          status: string
          updated_at: string
        }
        upsert: {
          created_at?: string
          deliverable: string
          due_date: string
          id?: string
          owner: string
          phase: string
          progress?: number
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deliverable?: string
          due_date?: string
          id?: string
          owner?: string
          phase?: string
          progress?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
      general_info: {
        Row: {
          created_at: string
          field: string
          id: string
          updated_at: string
          value: string
        }
        upsert: {
          created_at?: string
          field: string
          id?: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          field?: string
          id?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
        onConflict: 'field'
      }
      material_procurement: {
        Row: {
          created_at: string
          id: string
          initiation_date: string
          lead_time_days: number
          material_id: string
          material_name: string
          required_date: string
          status: string
          supplier: string
          updated_at: string
        }
        upsert: {
          created_at?: string
          id?: string
          initiation_date: string
          lead_time_days: number
          material_id: string
          material_name: string
          required_date: string
          status: string
          supplier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          initiation_date?: string
          lead_time_days?: number
          material_id?: string
          material_name?: string
          required_date?: string
          status?: string
          supplier?: string
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
      milestones: {
        Row: {
          created_at: string
          due_date: string
          id: string
          milestone: string
          phase: string
          progress: number
          status: string
          updated_at: string
        }
        upsert: {
          created_at?: string
          due_date: string
          id?: string
          milestone: string
          phase: string
          progress?: number
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: string
          milestone?: string
          phase?: string
          progress?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
      risks: {
        Row: {
          created_at: string
          id: string
          impact: number
          mitigation: string | null
          probability: number
          risk_id: string
          risk_name: string
          risk_score: number
          updated_at: string
        }
        upsert: {
          created_at?: string
          id?: string
          impact: number
          mitigation?: string | null
          probability: number
          risk_id: string
          risk_name: string
          risk_score: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          impact?: number
          mitigation?: string | null
          probability?: number
          risk_id?: string
          risk_name?: string
          risk_score?: number
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
      service_procurement: {
        Row: {
          created_at: string
          id: string
          initiation_date: string
          lead_time_days: number
          provider: string
          required_date: string
          service_id: string
          service_name: string
          status: string
          updated_at: string
        }
        upsert: {
          created_at?: string
          id?: string
          initiation_date: string
          lead_time_days: number
          provider: string
          required_date: string
          service_id: string
          service_name: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          initiation_date?: string
          lead_time_days?: number
          provider?: string
          required_date?: string
          service_id?: string
          service_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
        onConflict: 'id'
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
export type Tablesupsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      upsert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        upsert: infer I
      }
      ? I
      : never
    : never
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
export const Constants = {
  public: {
    Enums: {},
  },
} as const
