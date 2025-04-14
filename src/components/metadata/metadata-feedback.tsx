
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { AlertCircle, CheckCircle2, FileWarning, Info } from "lucide-react";

export type IssueType = {
  type: "error" | "warning" | "info" | "success";
  message: string;
};

interface MetadataFeedbackProps {
  score: number;
  issues: IssueType[];
  onValidate: () => void;
}

export const MetadataFeedback = ({ score, issues, onValidate }: MetadataFeedbackProps) => {
  // Helper function to get the right icon for each issue type
  const getIssueIcon = (type: IssueType["type"]) => {
    switch (type) {
      case "error":
        return <FileWarning className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-electric" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-mint" />;
    }
  };

  // Helper function to get the right background for each issue type
  const getIssueBg = (type: IssueType["type"]) => {
    switch (type) {
      case "error":
        return "border-red-500/30 bg-red-500/5";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "info":
        return "border-electric/30 bg-electric/5";
      case "success":
        return "border-mint/30 bg-mint/5";
    }
  };

  // Count issues by type
  const errorCount = issues.filter(i => i.type === "error").length;
  const warningCount = issues.filter(i => i.type === "warning").length;
  const infoCount = issues.filter(i => i.type === "info").length;
  const successCount = issues.filter(i => i.type === "success").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Metadata Quality</CardTitle>
          <CardDescription>Overall completeness score</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <ProgressCircle 
            value={score} 
            size={150} 
            color={score >= 90 ? "mint" : score >= 70 ? "electric" : "yellow-500"}
            label="Quality Score" 
          />
          
          <div className="mt-6 w-full space-y-3">
            <Button 
              onClick={onValidate} 
              className="w-full bg-electric hover:bg-electric/90 text-primary-foreground"
            >
              Validate Metadata
            </Button>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span>Errors</span>
                <span className={`px-2 py-0.5 rounded-full ${errorCount > 0 ? 'bg-red-500/20 text-red-500' : 'bg-muted/20'}`}>
                  {errorCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span>Warnings</span>
                <span className={`px-2 py-0.5 rounded-full ${warningCount > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted/20'}`}>
                  {warningCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span>Info</span>
                <span className={`px-2 py-0.5 rounded-full ${infoCount > 0 ? 'bg-electric/20 text-electric' : 'bg-muted/20'}`}>
                  {infoCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span>Success</span>
                <span className={`px-2 py-0.5 rounded-full ${successCount > 0 ? 'bg-mint/20 text-mint' : 'bg-muted/20'}`}>
                  {successCount}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Validation Issues</CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {issues.length === 0 ? (
              <div className="p-3 rounded-md border border-mint/30 bg-mint/5 flex gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-mint" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">All Clear!</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your metadata is looking great with no issues detected.
                  </p>
                </div>
              </div>
            ) : (
              issues.map((issue, index) => (
                <div key={index} className={`p-3 rounded-md border flex gap-3 ${getIssueBg(issue.type)}`}>
                  <div className="flex-shrink-0">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{issue.message}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {issue.type === "error" && "This must be resolved before distribution."}
                      {issue.type === "warning" && "Consider addressing this for better metadata quality."}
                      {issue.type === "info" && "Additional information that may improve your metadata."}
                      {issue.type === "success" && "This aspect of your metadata is complete."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
