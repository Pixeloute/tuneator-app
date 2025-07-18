
import { supabase } from "@/integrations/supabase/client";
import { InsightAlert } from "./types/insight-types";

export const alertsService = {
  async fetchAlerts(filters?: Partial<{
    type: InsightAlert['type'],
    severity: InsightAlert['severity'],
    is_read: boolean
  }>): Promise<InsightAlert[]> {
    let query = supabase.from('insight_alerts').select('*').order('created_at', { ascending: false });
    
    if (filters) {
      // Handle each filter separately to avoid deep type instantiation
      if (filters.type !== undefined) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.severity !== undefined) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    // Type assertion to ensure data conforms to InsightAlert
    return (data as unknown as InsightAlert[]) || [];
  },

  async markAlertAsRead(alertId: string): Promise<boolean> {
    const { error } = await supabase
      .from('insight_alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    return !error;
  },

  async clearAllAlerts(): Promise<boolean> {
    const { error } = await supabase
      .from('insight_alerts')
      .delete();

    return !error;
  }
};
