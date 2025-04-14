
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BulkEditPanelProps {
  selectedCount: number;
  bulkField: string;
  bulkValue: string;
  onFieldChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onApply: () => void;
}

export const BulkEditPanel = ({
  selectedCount,
  bulkField,
  bulkValue,
  onFieldChange,
  onValueChange,
  onApply
}: BulkEditPanelProps) => {
  return (
    <div className="p-4 rounded-md border border-border bg-secondary/20">
      <h3 className="text-sm font-medium mb-3">
        Bulk Edit {selectedCount > 0 && `(${selectedCount} tracks selected)`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Select 
            value={bulkField} 
            onValueChange={onFieldChange}
            disabled={selectedCount === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field to edit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="album">Album</SelectItem>
              <SelectItem value="artist">Artist</SelectItem>
              <SelectItem value="isrc">ISRC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <div className="flex gap-2">
            <Input 
              placeholder={`Enter new ${bulkField || 'value'}`}
              value={bulkValue}
              onChange={(e) => onValueChange(e.target.value)}
              disabled={selectedCount === 0 || !bulkField}
            />
            <Button 
              onClick={onApply}
              disabled={selectedCount === 0 || !bulkField || !bulkValue}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
