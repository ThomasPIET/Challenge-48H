import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function ZoneSelector({ selectedZone, onZoneChange }) {
    return (
        <div className="mb-4">
            <Label htmlFor="zone" className="block text-sm font-medium mb-2">
                Select Zone
            </Label>
            <Select onValueChange={(value) => onZoneChange(Number(value))} defaultValue={String(selectedZone)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Zone ${selectedZone}`} />
                </SelectTrigger>
                <SelectContent>
                    {[1, 2, 3, 4, 5].map((zone) => (
                        <SelectItem key={zone} value={String(zone)}>
                            Zone {zone}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default ZoneSelector;
