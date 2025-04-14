
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenreData {
  name: string;
  value: number;
}

export interface GenreDistributionChartProps {
  genreData: GenreData[];
  data?: GenreData[];
}

export const GenreDistributionChart = ({ genreData, data }: GenreDistributionChartProps) => {
  // Use either provided genreData or data prop
  const chartData = genreData || data || [];
  const COLORS = ["#4f46e5", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b"];

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Suggested Primary Genre: {chartData[0]?.name || "Electronic"}</h4>
        <p className="text-sm text-muted-foreground">
          The track has strong {chartData[0]?.name || "electronic"} elements with {chartData[1]?.name || "ambient"} influences. 
          Consider using both as primary and secondary genres.
        </p>
      </div>
    </div>
  );
};
