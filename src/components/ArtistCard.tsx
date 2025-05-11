import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Music, Instagram, Circle } from "lucide-react";

export type ArtistCardProps = {
  name: string;
  genre: string;
  label: string;
  country: string;
  avatarUrl?: string;
  status: "touring" | "recording" | "available";
  socials?: { spotify?: string; instagram?: string };
};

export const ArtistCard = ({ name, genre, label, country, avatarUrl, status, socials }: ArtistCardProps) => (
  <Card className="flex flex-col items-center gap-3 p-4 bg-secondary/80">
    <div className="relative">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <Circle className={`absolute -bottom-1 -right-1 h-5 w-5 ${status === "touring" ? "text-yellow-500" : status === "recording" ? "text-electric" : "text-mint"}`} fill="currentColor" />
    </div>
    <div className="text-center">
      <div className="text-lg font-bold">{name}</div>
      <div className="text-xs text-muted-foreground">{genre} • {label} • {country}</div>
    </div>
    <div className="flex gap-2 mt-2">
      {socials?.spotify && (
        <a href={socials.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify"><Music className="h-5 w-5 text-[#1DB954]" /></a>
      )}
      {socials?.instagram && (
        <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5 text-pink-500" /></a>
      )}
    </div>
    <Badge variant="outline" className="mt-2 capitalize">{status}</Badge>
  </Card>
); 