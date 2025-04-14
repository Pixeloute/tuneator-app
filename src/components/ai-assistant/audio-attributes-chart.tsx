
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AttributeData {
  name: string;
  value: number;
}

export interface AudioAttributesChartProps {
  attributesData: AttributeData[];
  energy?: number;
  danceability?: number;
  instrumentalness?: number;
  acousticness?: number;
  valence?: number;
}

export const AudioAttributesChart = ({ 
  attributesData, 
  energy, 
  danceability, 
  instrumentalness, 
  acousticness, 
  valence 
}: AudioAttributesChartProps) => {
  // If direct properties are provided, convert them to attributesData format
  const data = attributesData || [
    { name: "Energy", value: energy || 0 },
    { name: "Danceability", value: danceability || 0 },
    { name: "Instrumentalness", value: instrumentalness || 0 },
    { name: "Acousticness", value: acousticness || 0 },
    { name: "Valence", value: valence || 0 }
  ].filter(item => item.value > 0);
  
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Audio Characteristic Analysis</h4>
        <p className="text-sm text-muted-foreground">
          This track has high {data[0]?.name.toLowerCase()} and {data[1]?.name.toLowerCase()} with moderate {data[2]?.name.toLowerCase()}, 
          making it suitable for workout, dance, and electronic playlists.
        </p>
      </div>
    </div>
  );
};
