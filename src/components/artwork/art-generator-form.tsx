
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
  trackName: z.string().min(1, "Track name is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  mood: z.string().min(1, "Please select a mood"),
  genre: z.string().min(1, "Please select a genre"),
});

type FormValues = z.infer<typeof formSchema>;

const moodOptions = [
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "energetic", label: "Energetic" },
  { value: "calm", label: "Calm" },
  { value: "dark", label: "Dark" },
  { value: "uplifting", label: "Uplifting" },
  { value: "nostalgic", label: "Nostalgic" },
  { value: "dreamy", label: "Dreamy" },
  { value: "aggressive", label: "Aggressive" },
  { value: "romantic", label: "Romantic" },
];

const genreOptions = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hiphop", label: "Hip Hop" },
  { value: "electronic", label: "Electronic" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
  { value: "rnb", label: "R&B" },
  { value: "country", label: "Country" },
  { value: "folk", label: "Folk" },
  { value: "metal", label: "Metal" },
  { value: "ambient", label: "Ambient" },
  { value: "punk", label: "Punk" },
  { value: "blues", label: "Blues" },
  { value: "reggae", label: "Reggae" },
  { value: "indie", label: "Indie" },
];

interface ArtGeneratorFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading: boolean;
}

export function ArtGeneratorForm({ onSubmit, isLoading }: ArtGeneratorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackName: "",
      description: "",
      mood: "",
      genre: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="trackName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track or Album Name</FormLabel>
              <FormControl>
                <Input placeholder="My Amazing Track" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Theme / Lyrics</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your track's theme, mood, or paste some lyrics here..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genreOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Artwork"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
