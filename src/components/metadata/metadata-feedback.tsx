
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle, Info, RefreshCw, Save, Wand2 } from "lucide-react";
import { useMetadata, IssueType } from "@/contexts/metadata";

interface MetadataFeedbackProps {
  score: number;
  issues: IssueType[];
  onValidate: () => void;
}

export const MetadataFeedback = ({ score, issues, onValidate }: MetadataFeedbackProps) => {
  const { handleSaveMetadata, handleAiAudit } = useMetadata();

  // Helper function to determine text color based on issue type
  const getIssueColor = (type: IssueType["type"]) => {
    switch (type) {
      case "error": return "text-red-500";
      case "warning": return "text-amber-500";
      case "info": return "text-blue-500";
      case "success": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  // Helper function to get icon based on issue type
  const getIssueIcon = (type: IssueType["type"]) => {
    switch (type) {
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  // Get progress color based on score
  const getProgressColor = () => {
    if (score < 50) return "bg-red-500";
    if (score < 80) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <CardHeader className="pb-2 sticky top-0 bg-card z-10">
        <CardTitle className="text-lg font-medium">Metadata Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quality Score</span>
            <span className="font-bold">{score}%</span>
          </div>
          <Progress value={score} className={`h-2 ${getProgressColor()}`} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Validation Issues</span>
            <Button variant="ghost" size="sm" onClick={onValidate} className="h-6 px-2">
              <RefreshCw className="h-3 w-3 mr-1" />
              <span className="text-xs">Validate</span>
            </Button>
          </div>
          
          {issues.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {issues.map((issue, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-0 mb-1">
                  <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-muted/50 data-[state=open]:bg-muted/40">
                    <div className="flex items-center gap-2">
                      {getIssueIcon(issue.type)}
                      <span className={`text-xs ${getIssueColor(issue.type)}`}>
                        {issue.message}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground px-3 pt-1 pb-2">
                    {issue.type === "error" && "This issue must be fixed before distribution."}
                    {issue.type === "warning" && "This issue should be fixed for optimal distribution."}
                    {issue.type === "info" && "Consider addressing this for better metadata quality."}
                    {issue.type === "success" && "This issue has been successfully resolved."}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-2 text-sm text-muted-foreground">
              No issues found. Looks good!
            </div>
          )}
        </div>
        
        <div className="space-y-3 pt-2">
          <Button 
            onClick={handleAiAudit}
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Audit &amp; Fix
          </Button>
          
          <Button 
            onClick={handleSaveMetadata}
            className="w-full bg-electric hover:bg-electric/90 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Metadata
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
