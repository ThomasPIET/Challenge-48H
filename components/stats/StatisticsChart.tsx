import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";

function StatisticsChart({ data, selectedMetrics }) {
    return (
        <div className="mt-6">
            <BarChart width={700} height={300} data={data}>
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
    );
}

export default StatisticsChart;
