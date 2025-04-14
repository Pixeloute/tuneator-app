
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Info, 
  AlertCircle, 
  Flame, 
  Filter, 
  X 
} from "lucide-react";

import { alertsService } from "@/services/alerts-service";
import { InsightAlert } from "@/services/types/insight-types";
import { useToast } from "@/hooks/use-toast";

export const InsightPulseFeed: React.FC = () => {
  const [alerts, setAlerts] = useState<InsightAlert[]>([]);
  const [filters, setFilters] = useState<{
    type?: InsightAlert['type'],
    severity?: InsightAlert['severity']
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
  }, [filters]);

  const loadAlerts = async () => {
    const fetchedAlerts = await alertsService.fetchAlerts(filters);
    setAlerts(fetchedAlerts);
  };

  const handleMarkAsRead = async (alertId: string) => {
    const success = await alertsService.markAlertAsRead(alertId);
    if (success) {
      loadAlerts();
      toast({
        title: "Alert Marked as Read",
        description: "The alert has been updated.",
      });
    }
  };

  const handleClearAll = async () => {
    const success = await alertsService.clearAllAlerts();
    if (success) {
      setAlerts([]);
      toast({
        title: "Alerts Cleared",
        description: "All alerts have been removed.",
      });
    }
  };

  const getAlertIcon = (severity: InsightAlert['severity']) => {
    switch(severity) {
      case 'info': return <Info className="text-blue-500" />;
      case 'moderate': return <Bell className="text-yellow-500" />;
      case 'critical': return <AlertCircle className="text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Insight Pulse™ Feed</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setFilters({})}>
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              <X className="h-4 w-4 mr-2" /> Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <Flame className="mx-auto mb-2 h-8 w-8 text-electric" />
            <p>No new insights at the moment</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className="bg-secondary/50 rounded-md p-3 flex items-center justify-between hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.severity)}
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant="outline" className="mt-1">
                      {alert.type}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleMarkAsRead(alert.id)}
                >
                  Mark Read
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
