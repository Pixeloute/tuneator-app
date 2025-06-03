import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  created_at: string;
}

export const notificationsService = {
  async fetchNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return (data as Notification[]) || [];
  },

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    return !error;
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    return !error;
  },

  async createNotification({ user_id, title, message, category }: {
    user_id: string;
    title: string;
    message: string;
    category: string;
  }): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ user_id, title, message, category, is_read: false }])
      .select()
      .single();
    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    return data as Notification;
  },

  async notifyRole({ role, title, message, category }: {
    role: string;
    title: string;
    message: string;
    category: string;
  }): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('id')
      .eq('role', role);
    if (error || !data) return [];
    const userIds = data.map((u: { id: string }) => u.id);
    const results = await Promise.all(
      userIds.map(user_id => this.createNotification({ user_id, title, message, category }))
    );
    return results.filter(Boolean) as Notification[];
  },
}; 