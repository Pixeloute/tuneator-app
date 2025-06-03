import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { notificationsService, Notification } from "@/services/notifications-service";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    notificationsService.fetchNotifications(user.id)
      .then(setNotifications)
      .catch(() => setError("Failed to load notifications."))
      .finally(() => setLoading(false));
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        payload => {
          setNotifications(n => [payload.new as Notification, ...n]);
        }
      )
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user]);

  const markAsRead = async id => {
    await notificationsService.markNotificationAsRead(id);
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, is_read: true } : notif));
  };

  const deleteNotif = async id => {
    await notificationsService.deleteNotification(id);
    setNotifications(n => n.filter(notif => notif.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white">{unreadCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <Card>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto divide-y">
              {loading && (
                <div className="flex justify-center items-center p-6 text-gray-400">
                  <Loader2 className="animate-spin mr-2" /> Loading...
                </div>
              )}
              {error && (
                <div className="p-4 text-center text-red-500">{error}</div>
              )}
              {!loading && !error && notifications.length === 0 && (
                <div className="p-4 text-center text-gray-400">No notifications</div>
              )}
              {!loading && !error && notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-2 p-4 ${notif.is_read ? "bg-gray-50" : "bg-blue-50"}`}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{notif.title}</div>
                    <div className="text-sm">{notif.message}</div>
                    <div className="text-xs text-gray-400">{notif.category}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notif.is_read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                        Mark as read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteNotif(notif.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
} 