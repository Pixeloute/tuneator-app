
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GenreData {
  name: string;
  value: number;
}

interface GenreDistributionChartProps {
  genreData: GenreData[];
}

export const GenreDistributionChart = ({ genreData }: GenreDistributionChartProps) => {
  const COLORS = ["#4f46e5", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b"];

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genreData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {genreData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Suggested Primary Genre: {genreData[0]?.name || "Electronic"}</h4>
        <p className="text-sm text-muted-foreground">
          The track has strong {genreData[0]?.name || "electronic"} elements with {genreData[1]?.name || "ambient"} influences. 
          Consider using both as primary and secondary genres.
        </p>
      </div>
    </div>
  );
};
