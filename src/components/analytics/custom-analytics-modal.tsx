
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { fetchCustomAnalytics } from "@/services/revenue-service";
import { toast } from "sonner";

interface CustomAnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomAnalyticsModal({ open, onOpenChange }: CustomAnalyticsModalProps) {
  // State for filter selections
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 6)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Spotify", "Apple Music", "YouTube", "Other"]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Available platforms
  const platforms = [
    { id: "Spotify", name: "Spotify" },
    { id: "Apple Music", name: "Apple Music" },
    { id: "YouTube", name: "YouTube" },
    { id: "Other", name: "Other Platforms" }
  ];
  
  // Handle platform selection toggle
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format dates for API
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      
      // Call API
      const data = await fetchCustomAnalytics({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        platforms: selectedPlatforms
      });
      
      if (data) {
        toast.success("Custom analytics generated! Check your report");
        // In a real app, we would display the results in a chart or table
        // For now, just close the modal
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error generating custom analytics:", error);
      toast.error("Failed to generate custom analytics");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Custom Analytics</DialogTitle>
          <DialogDescription>
            Configure custom filters to analyze your royalty data across platforms,
            dates, and regions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Platforms */}
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`flex items-center rounded-full px-3 py-1 text-sm ${
                    selectedPlatforms.includes(platform.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`platform-${platform.id}`}
                    className="cursor-pointer"
                  >
                    {platform.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional filters could be added here */}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Analytics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
