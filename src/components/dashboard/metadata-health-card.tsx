
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCircle } from "@/components/ui/progress-circle";

interface MetadataHealthCardProps {
  score: number;
  issues: { category: string; count: number }[];
}

export const MetadataHealthCard = ({ score, issues }: MetadataHealthCardProps) => {
  return (
    <Card className="col-span-1 md:col-span-1">
      <CardHeader>
        <CardTitle>Metadata Health</CardTitle>
        <CardDescription>Overall catalog quality score</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <ProgressCircle 
          value={score} 
          size={150} 
          color={score > 70 ? "mint" : "electric"} 
          label="Health Score"
        />
        
        <div className="space-y-3 w-full">
          <h4 className="text-sm font-medium">Issues By Category</h4>
          {issues.map((issue) => (
            <div key={issue.category} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{issue.category}</div>
              <div className="flex items-center">
                <span className={`text-sm px-2 py-0.5 rounded-full ${issue.count > 3 ? 'bg-red-500/20 text-red-400' : 'bg-muted/20 text-muted-foreground'}`}>
                  {issue.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
