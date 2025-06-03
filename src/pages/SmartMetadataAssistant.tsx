import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { useToast } from "@/hooks/use-toast";
import { fetchMetadataTransform } from "@/services/metadata-service";
import { z } from "zod";
 
// --- Types ---
type Mode = "audio" | "label" | "variant" | "audit";
interface ApiPayload {
  files?: File[];
  spreadsheet?: File;
  text?: string;
  original?: string;
  variant?: string;
  mode: Mode;
  prompt: string;
}
interface ApiResponse {
  result?: string;
  tags?: string[];
  moods?: string[];
  conflicts?: string[];
  metadata?: Record<string, any>;
  [key: string]: any;
}

// --- Copy (i18n ready) ---
const COPY = {
  modes: [
    { value: "audio", label: "Audio Upload" },
    { value: "label", label: "Label Copy Ingest" },
    { value: "variant", label: "Variant Generator" },
    { value: "audit", label: "Audit Validator" },
  ],
  prompts: {
    audio: "Generate metadata from audio.",
    label: "Convert label copy to metadata JSON.",
    variant: "Show differences between original and variant metadata.",
    audit: "Audit this metadata for issues.",
    spreadsheet: "Batch process spreadsheet rows into metadata.",
  },
  chooseMode: "Choose a mode",
  uploadAudio: "Upload audio files",
  uploadAudioDesc: "You can upload one or more audio files.",
  pasteLabel: "Paste label copy",
  pasteLabelDesc: "Paste the text metadata you want to convert.",
  originalMeta: "Original metadata",
  variantMeta: "Variant metadata",
  bothRequired: "Enter both original and variant to see differences.",
  auditMeta: "Metadata to audit",
  auditMetaDesc: "Paste metadata to review and flag issues.",
  uploadSheet: "Or upload a spreadsheet",
  uploadSheetDesc: "Upload a spreadsheet for batch processing.",
  runAI: "Run AI",
  working: "Working...",
  aiResponse: "AI Response",
  smartSuggestions: "Smart Suggestions",
  tags: "Tags:",
  moods: "Moods:",
  conflicts: "Conflicts:",
  aiMetadata: "AI Metadata:",
  noMetadata: "No metadata yet.",
};

// --- Validation Schemas ---
const variantSchema = z.object({ original: z.string().min(1), variant: z.string().min(1) });
const textSchema = z.string().min(1);

// --- Analytics/Feature Flag Placeholder ---
// const { trackEvent, isFeatureEnabled } = useAnalyticsOrFeatureFlag();

// --- Debounce util ---
function useDebouncedCallback(cb: (...args: any[]) => void, delay: number) {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  return (...args: any[]) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => cb(...args), delay);
  };
}

// --- Mode Fields Component ---
function ModeFields({ mode, audioFiles, onAudio, textInput, onText, variantInput, onVariant, errorIds }: any) {
  switch (mode) {
    case "audio":
      return (
        <div className="space-y-2">
          <label htmlFor="audio-upload" className="block font-medium">{COPY.uploadAudio}</label>
          <input id="audio-upload" data-testid="audio-upload" type="file" accept="audio/*" multiple onChange={onAudio} className="block" title={COPY.uploadAudio} placeholder="Choose audio files" aria-describedby={errorIds.audio} />
          <div className="text-xs text-muted-foreground">{COPY.uploadAudioDesc}</div>
        </div>
      );
    case "label":
      return (
        <div className="space-y-2">
          <label htmlFor="label-text" className="block font-medium">{COPY.pasteLabel}</label>
          <Textarea id="label-text" data-testid="label-text" value={textInput} onChange={onText} placeholder={COPY.pasteLabel} rows={6} aria-describedby={errorIds.text} />
          <div className="text-xs text-muted-foreground">{COPY.pasteLabelDesc}</div>
        </div>
      );
    case "variant":
      return (
        <div className="space-y-2">
          <label htmlFor="original-meta" className="block font-medium">{COPY.originalMeta}</label>
          <Textarea id="original-meta" data-testid="original-meta" value={variantInput.original} onChange={e => onVariant("original", e.target.value)} placeholder={COPY.originalMeta} rows={3} aria-describedby={errorIds.original} />
          <label htmlFor="variant-meta" className="block font-medium">{COPY.variantMeta}</label>
          <Textarea id="variant-meta" data-testid="variant-meta" value={variantInput.variant} onChange={e => onVariant("variant", e.target.value)} placeholder={COPY.variantMeta} rows={3} aria-describedby={errorIds.variant} />
          <div className="text-xs text-muted-foreground">{COPY.bothRequired}</div>
        </div>
      );
    case "audit":
      return (
        <div className="space-y-2">
          <label htmlFor="audit-meta" className="block font-medium">{COPY.auditMeta}</label>
          <Textarea id="audit-meta" data-testid="audit-meta" value={textInput} onChange={onText} placeholder={COPY.auditMeta} rows={6} aria-describedby={errorIds.text} />
          <div className="text-xs text-muted-foreground">{COPY.auditMetaDesc}</div>
        </div>
      );
    default:
      return null;
  }
}

// --- Sidebar Component ---
function SmartSuggestionsSidebar({ suggestions }: { suggestions: ApiResponse }) {
  return (
    <Card className="p-4 space-y-3" data-testid="smart-suggestions">
      <h2 className="font-bold text-lg mb-2">{COPY.smartSuggestions}</h2>
      <div>
        <div className="font-semibold">{COPY.tags}</div>
        <div className="flex flex-wrap gap-1">{suggestions.tags?.map((tag: string) => <span key={tag} className="bg-muted px-2 py-1 rounded">{tag}</span>)}</div>
      </div>
      <div>
        <div className="font-semibold">{COPY.moods}</div>
        <div className="flex flex-wrap gap-1">{suggestions.moods?.map((mood: string) => <span key={mood} className="bg-muted px-2 py-1 rounded">{mood}</span>)}</div>
      </div>
      <div>
        <div className="font-semibold">{COPY.conflicts}</div>
        <ul className="list-disc ml-5">{suggestions.conflicts?.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
      </div>
      <div>
        <div className="font-semibold">{COPY.aiMetadata}</div>
        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">{suggestions.metadata ? JSON.stringify(suggestions.metadata, null, 2) : COPY.noMetadata}</pre>
      </div>
    </Card>
  );
}

const SmartMetadataAssistant = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("audio");
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [variantInput, setVariantInput] = useState({ original: "", variant: "" });
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [suggestions, setSuggestions] = useState<ApiResponse>({});
  const debouncedSubmit = useDebouncedCallback(handleSubmit, 300);

  // --- Handlers ---
  function handleModeChange(value: Mode) {
    setMode(value);
    setAiResponse(null);
    setError(null);
    setFieldErrors({});
  }
  function handleAudioFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setAudioFiles(Array.from(e.target.files));
  }
  function handleSpreadsheetChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setSpreadsheetFile(e.target.files[0]);
  }
  function handleTextInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) { setTextInput(e.target.value); }
  function handleVariantInputChange(field: "original" | "variant", value: string) { setVariantInput((prev) => ({ ...prev, [field]: value })); }

  // --- Validation and Submit ---
  async function handleSubmit() {
    setLoading(true);
    setAiResponse(null);
    setError(null);
    setFieldErrors({});
    try {
      let payload: ApiPayload = { mode, prompt: COPY.prompts[mode] };
      // Spreadsheet overrides all
      if (spreadsheetFile) {
        payload = { spreadsheet: spreadsheetFile, mode, prompt: COPY.prompts.spreadsheet };
      } else if (mode === "audio") {
        if (!audioFiles.length) throw new Error("Please upload at least one audio file.");
        payload.files = audioFiles;
      } else if (mode === "label" || mode === "audit") {
        const result = textSchema.safeParse(textInput);
        if (!result.success) {
          setFieldErrors({ text: "This field is required." });
          setLoading(false);
          return;
        }
        payload.text = textInput;
      } else if (mode === "variant") {
        const result = variantSchema.safeParse(variantInput);
        if (!result.success) {
          setFieldErrors({
            original: !variantInput.original ? "Required." : "",
            variant: !variantInput.variant ? "Required." : ""
          });
          setLoading(false);
          return;
        }
        payload.original = variantInput.original;
        payload.variant = variantInput.variant;
      }
      // Analytics/feature flag example:
      // if (isFeatureEnabled('metadata-assistant')) trackEvent('run_ai', { mode });
      const response: ApiResponse = await fetchMetadataTransform(payload);
      setAiResponse(response.result || JSON.stringify(response, null, 2));
      setSuggestions(response);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // --- Error IDs for a11y ---
  const errorIds = {
    audio: fieldErrors.audio ? "audio-upload-error" : undefined,
    text: fieldErrors.text ? "label-text-error" : undefined,
    original: fieldErrors.original ? "original-meta-error" : undefined,
    variant: fieldErrors.variant ? "variant-meta-error" : undefined,
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16 max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Smart Metadata Assistant</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 space-y-4" data-testid="main-card">
                  <div>
                    <label className="block font-medium mb-1" htmlFor="mode-select">{COPY.chooseMode}</label>
                    <Select value={mode} onValueChange={handleModeChange}>
                      <SelectTrigger id="mode-select" data-testid="mode-select" />
                      <SelectContent>
                        {COPY.modes.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ModeFields
                    mode={mode}
                    audioFiles={audioFiles}
                    onAudio={handleAudioFilesChange}
                    textInput={textInput}
                    onText={handleTextInputChange}
                    variantInput={variantInput}
                    onVariant={handleVariantInputChange}
                    errorIds={errorIds}
                  />
                  {fieldErrors.audio && <div id="audio-upload-error" className="text-red-600 text-sm" aria-live="polite">{fieldErrors.audio}</div>}
                  {fieldErrors.text && <div id="label-text-error" className="text-red-600 text-sm" aria-live="polite">{fieldErrors.text}</div>}
                  {fieldErrors.original && <div id="original-meta-error" className="text-red-600 text-sm" aria-live="polite">{fieldErrors.original}</div>}
                  {fieldErrors.variant && <div id="variant-meta-error" className="text-red-600 text-sm" aria-live="polite">{fieldErrors.variant}</div>}
                  <div>
                    <label className="block font-medium mb-1" htmlFor="spreadsheet-upload">{COPY.uploadSheet}</label>
                    <input id="spreadsheet-upload" data-testid="spreadsheet-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleSpreadsheetChange} className="block" title={COPY.uploadSheet} placeholder="Choose spreadsheet file" />
                    <div className="text-xs text-muted-foreground">{COPY.uploadSheetDesc}</div>
                  </div>
                  <Button onClick={debouncedSubmit} disabled={loading} className="mt-2 w-full" data-testid="run-ai">
                    {loading ? COPY.working : COPY.runAI}
                  </Button>
                  {error && <div className="text-red-600 text-sm" aria-live="polite">{error}</div>}
                  {aiResponse && (
                    <div>
                      <label className="block font-medium mb-1">{COPY.aiResponse}</label>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto" data-testid="ai-response">{aiResponse}</pre>
                    </div>
                  )}
                </Card>
              </div>
              <div><SmartSuggestionsSidebar suggestions={suggestions} /></div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SmartMetadataAssistant;
