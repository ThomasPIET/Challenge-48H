"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const chartData = [
    { zone: 1, month: "Jan", earthquake: 2, flood: 0 },
    { zone: 1, month: "Feb", earthquake: 3, flood: 1 },
    { zone: 1, month: "Mar", earthquake: 1, flood: 0 },
    { zone: 1, month: "Apr", earthquake: 0, flood: 2 },
    { zone: 1, month: "May", earthquake: 1, flood: 0 },
    { zone: 1, month: "Jun", earthquake: 0, flood: 1 },
    { zone: 1, month: "Jul", earthquake: 2, flood: 0 },
    { zone: 1, month: "Aug", earthquake: 1, flood: 1 },
    { zone: 1, month: "Sep", earthquake: 0, flood: 0 },
    { zone: 1, month: "Oct", earthquake: 1, flood: 2 },
    { zone: 1, month: "Nov", earthquake: 3, flood: 1 },
    { zone: 1, month: "Dec", earthquake: 2, flood: 0 },
];

export function Stats() {
    const [selectedZone, setSelectedZone] = useState(1);
    const [selectedMetrics, setSelectedMetrics] = useState(["earthquake", "flood"]);
    const [isClient, setIsClient] = useState(false);  // Nouveau state pour contrôler l'hydratation

    useEffect(() => {
        setIsClient(true);  // Après le premier rendu côté client
    }, []);

    const handleMetricToggle = (metric: string) => {
        setSelectedMetrics((prev) =>
            prev.includes(metric)
                ? prev.filter((m) => m !== metric)
                : [...prev, metric]
        );
    };

    const filteredData = chartData.filter((data) => data.zone === selectedZone);

    if (!isClient) {
        return null;  // Ne rend pas le composant tant que l'hydratation n'est pas terminée
    }

    return (
        <Card className="p-6 max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Zone Statistics</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Select a zone and metrics to view statistics for the entire year.
                </p>
            </CardHeader>
            <CardContent>
                {/* Zone Selector */}
                <div className="mb-4">
                    <Label htmlFor="zone" className="block text-sm font-medium mb-2">
                        Select Zone
                    </Label>
                    <Select
                        onValueChange={(value) => setSelectedZone(Number(value))}
                        defaultValue={String(selectedZone)}
                    >
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

                {/* Metrics Selector */}
                <div className="mb-4">
                    <span className="block text-sm font-medium mb-2">
                        Select Metrics to Display
                    </span>
                    <div className="flex gap-4 flex-wrap">
                        {["earthquake", "flood"].map((metric) => (
                            <Label key={metric} className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedMetrics.includes(metric)}
                                    onCheckedChange={() => handleMetricToggle(metric)}
                                />
                                <span className="capitalize text-sm">{metric}</span>
                            </Label>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="mt-6">
                    <BarChart width={700} height={300} data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <Tooltip />
                        {selectedMetrics.map((metric) => (
                            <Bar
                                key={metric}
                                dataKey={metric}
                                fill={metric === "earthquake" ? "#a36603" : "#044bbd"}
                            />
                        ))}
                    </BarChart>
                </div>
            </CardContent>
        </Card>
    );
}

export default Stats;
