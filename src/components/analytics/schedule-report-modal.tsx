
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scheduleMonthlyReport } from "@/services/revenue-service";
import { Calendar, Mail } from "lucide-react";

interface ScheduleReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleReportModal({ open, onOpenChange }: ScheduleReportModalProps) {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await scheduleMonthlyReport(email);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
          <DialogDescription>
            Set up automated royalty reports delivered directly to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Report Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency" className="w-full">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select frequency" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
                <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !email}>
            {isLoading ? "Scheduling..." : "Schedule Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
