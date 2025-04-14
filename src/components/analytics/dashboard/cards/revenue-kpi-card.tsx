
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";

interface RevenueKpiCardProps {
  totalRevenue: string;
  revenueGrowth: string;
}

export function RevenueKpiCard({ totalRevenue, revenueGrowth }: RevenueKpiCardProps) {
  const growthValue = Number(revenueGrowth);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1">${totalRevenue}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-electric/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-electric" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <Badge variant="outline" className={`flex items-center gap-1 ${growthValue >= 0 ? 'bg-mint/10 text-mint' : 'bg-destructive/10 text-destructive'}`}>
            <TrendingUp className="h-3 w-3" />
            {revenueGrowth}%
          </Badge>
          <span className="text-muted-foreground ml-2">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  );
}
