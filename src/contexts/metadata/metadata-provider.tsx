
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { MetadataFormState, MetadataContextProps, IssueType } from "./types";
import { initialFormState } from "./initial-state";
import { validateMetadata } from "./validator";
import { handleAiAudit } from "./ai-audit";
import { toast } from "./use-toast-import";
import { calculateMetadataScore } from "@/lib/metadata-validator";

const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<MetadataFormState>(initialFormState);
  const [metadataQualityScore, setMetadataQualityScore] = useState(45);
  const [validationIssues, setValidationIssues] = useState<IssueType[]>([
    { type: "warning", message: "ISWC code missing" },
    { type: "warning", message: "Several credits fields are empty" },
    { type: "info", message: "Consider adding more detailed artist information" }
  ]);

  useEffect(() => {
    const newScore = calculateMetadataScore(formState);
    setMetadataQualityScore(newScore);
  }, [formState]);

  const updateForm = (field: keyof MetadataFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runValidateMetadata = () => {
    const newIssues = validateMetadata(formState);
    setValidationIssues(newIssues);
  };

  const handleSaveMetadata = () => {
    // Validate metadata before saving
    runValidateMetadata();
    
    // This would usually involve API calls to save the data
    toast({
      title: "Metadata Saved",
      description: `Your metadata quality score is now ${metadataQualityScore}%`,
      variant: "default",
    });
  };

  const runAiAudit = () => {
    handleAiAudit(
      formState, 
      setFormState, 
      validationIssues, 
      setValidationIssues, 
      setMetadataQualityScore, 
      metadataQualityScore
    );
  };

  return (
    <MetadataContext.Provider 
      value={{ 
        formState, 
        metadataQualityScore, 
        validationIssues, 
        updateForm, 
        validateMetadata: runValidateMetadata, 
        handleAiAudit: runAiAudit, 
        handleSaveMetadata 
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
