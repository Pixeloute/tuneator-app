
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Music } from "lucide-react";

interface RoyaltyEvent {
  id: string;
  type: "payment" | "usage" | "registration";
  title: string;
  date: string;
  amount?: string;
  source?: string;
  location?: string;
}

interface RoyaltyFeedCardProps {
  events: RoyaltyEvent[];
}

export const RoyaltyFeedCard = ({ events }: RoyaltyFeedCardProps) => {
  const getEventIcon = (type: RoyaltyEvent["type"]) => {
    switch (type) {
      case "payment":
        return <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20">Payment</Badge>;
      case "usage":
        return <Badge variant="outline" className="bg-electric/10 text-electric border-electric/20">Usage</Badge>;
      case "registration":
        return <Badge variant="outline" className="bg-bright-purple/10 text-bright-purple border-bright-purple/20">Registration</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Royalty Feed</CardTitle>
        <CardDescription>Recent activity and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  {getEventIcon(event.type)}
                </div>
                <span className="text-xs text-muted-foreground">{event.date}</span>
              </div>
              <h4 className="text-sm font-medium mb-1">{event.title}</h4>
              {event.amount && (
                <div className="flex items-center text-mint text-sm font-medium">
                  ${event.amount}
                </div>
              )}
              {event.source && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Music className="h-3 w-3" />
                  <span>{event.source}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Globe className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
