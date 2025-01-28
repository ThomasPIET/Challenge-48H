import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function MetricSelector({ selectedMetrics, onMetricToggle }) {
    const metrics = ["earthquake", "flood"];
    return (
        <div className="mb-4">
            <span className="block text-sm font-medium mb-2">Select Metrics to Display</span>
            <div className="flex gap-4 flex-wrap">
                {metrics.map((metric) => (
                    <Label key={metric} className="flex items-center gap-2">
                        <Checkbox
                            checked={selectedMetrics.includes(metric)}
                            onCheckedChange={() => onMetricToggle(metric)}
                        />
                        <span className="capitalize text-sm">{metric}</span>
                    </Label>
                ))}
            </div>
        </div>
    );
}

export default MetricSelector;
