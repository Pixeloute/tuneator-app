
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AttributeData {
  name: string;
  value: number;
}

interface AudioAttributesChartProps {
  attributesData: AttributeData[];
}

export const AudioAttributesChart = ({ attributesData }: AudioAttributesChartProps) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={attributesData}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Audio Characteristic Analysis</h4>
        <p className="text-sm text-muted-foreground">
          This track has high {attributesData[0]?.name.toLowerCase()} and {attributesData[1]?.name.toLowerCase()} with moderate {attributesData[2]?.name.toLowerCase()}, 
          making it suitable for workout, dance, and electronic playlists.
        </p>
      </div>
    </div>
  );
};
