import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function YearSelector({ selectedYear, availableYears, onYearChange }) {
    return (
        <div className="mb-4">
            <Label htmlFor="year" className="block text-sm font-medium mb-2">
                Select Year
            </Label>
            <Select onValueChange={(value) => onYearChange(Number(value))} defaultValue={String(selectedYear)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={String(selectedYear)} />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default YearSelector;
