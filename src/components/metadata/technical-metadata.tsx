import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AudioWaveform, Info } from "lucide-react";

interface TechnicalMetadataProps {
  initialValues: {
    duration: number;
    sampleRate: number;
    bitDepth: number;
    codec: string;
    channels: number;
  };
  onSubmit: (values: any) => void;
}

export const TechnicalMetadata = ({ initialValues, onSubmit }: TechnicalMetadataProps) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (key: string, value: any) => {
    setValues({ ...values, [key]: value });
  };

  return (
    <div className="grid gap-4">
      <FormField>
        <FormItem>
          <FormLabel>Duration (seconds)</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={values.duration}
                onChange={(e) => handleChange("duration", parseFloat(e.target.value))}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total length of the audio track.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          <FormDescription>The total length of the audio track in seconds.</FormDescription>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel>Sample Rate (Hz)</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={values.sampleRate}
                onChange={(e) => handleChange("sampleRate", parseInt(e.target.value))}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of samples per second.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          <FormDescription>The number of samples of audio carried per second.</FormDescription>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel>Bit Depth</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={values.bitDepth}
                onChange={(e) => handleChange("bitDepth", parseInt(e.target.value))}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of bits used per sample.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          <FormDescription>The number of bits used for each audio sample.</FormDescription>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel>Audio Codec</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={values.codec}
                onChange={(e) => handleChange("codec", e.target.value)}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The method used to compress the audio data.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          <FormDescription>The method used to compress and decompress the audio data.</FormDescription>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel>Channels</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={values.channels}
                onChange={(e) => handleChange("channels", parseInt(e.target.value))}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The number of independent audio channels.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          <FormDescription>The number of independent audio channels in the file.</FormDescription>
        </FormItem>
      </FormField>
    </div>
  );
};
