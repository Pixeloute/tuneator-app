
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterSelect = ({ value, onChange }: FilterSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tracks</SelectItem>
        <SelectItem value="issues">Has Issues</SelectItem>
        <SelectItem value="noIssues">No Issues</SelectItem>
      </SelectContent>
    </Select>
  );
};
