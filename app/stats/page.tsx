"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ZoneSelector from "../../components/stats/ZoneSelector";
import YearSelector from "../../components/stats/YearSelector";
import MetricSelector from "../../components/stats/MetricSelector";
import StatisticsChart from "../../components/stats/StatisticsChart";

export function Stats() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState(1);
    const [selectedMetrics, setSelectedMetrics] = useState(["earthquake", "flood"]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [isClient, setIsClient] = useState(false);

    const extractZoneNumber = (zoneString) => {
        const match = zoneString.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/csv-data");
                const data = await response.json();
                setNews(
                    data.map((item) => ({
                        ...item,
                        zoneNumber: extractZoneNumber(item.quartier),
                    }))
                );
                setLoading(false);
                setAvailableYears([...new Set(data.map((item) => new Date(item.date).getFullYear()))]);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const chartData = news
        .filter((item) => {
            const itemYear = new Date(item.date).getFullYear();
            const itemZone = item.quartier.trim().toLowerCase();
            const isMatchingZone = selectedZone === 0 || itemZone === `zone ${selectedZone}`.toLowerCase();
            return itemYear === selectedYear && isMatchingZone;
        })
        .map((item) => ({
            zone: item.quartier,
            month: new Date(item.date).toLocaleString("en", { month: "short" }),
            earthquake: item.seisme === "True" ? 1 : 0,
            flood: item.inondation === "True" ? 1 : 0,
        }));

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = months.map((month) => {
        const dataForMonth = chartData.filter((item) => item.month === month);
        return {
            month,
            earthquake: dataForMonth.reduce((acc, item) => acc + item.earthquake, 0),
            flood: dataForMonth.reduce((acc, item) => acc + item.flood, 0),
        };
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleMetricToggle = (metric) => {
        setSelectedMetrics((prev) =>
            prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
        );
    };

    if (!isClient || loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="p-6 max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Zone Statistics</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Select a zone, year, and metrics to view statistics for the entire year.
                </p>
            </CardHeader>
            <CardContent>
                <ZoneSelector selectedZone={selectedZone} onZoneChange={setSelectedZone} />
                <YearSelector
                    selectedYear={selectedYear}
                    availableYears={availableYears}
                    onYearChange={setSelectedYear}
                />
                <MetricSelector selectedMetrics={selectedMetrics} onMetricToggle={handleMetricToggle} />
                <StatisticsChart data={monthlyData} selectedMetrics={selectedMetrics} />
            </CardContent>
        </Card>
    );
}

export default Stats;
