
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AccountSettingsFormProps {
  user: User;
}

const accountFormSchema = z.object({
  email: z.string().email().optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user metadata
  const metadata = user.user_metadata || {};
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user.email || "",
      bio: metadata.bio || "",
      username: metadata.username || "",
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          username: data.username,
          bio: data.bio,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account updated",
        description: "Your account information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: "Failed to update account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Update your account information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Your email address cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter a username" />
                  </FormControl>
                  <FormDescription>
                    This will be displayed in your profile and in mentions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tell us a bit about yourself" 
                      className="min-h-[100px] resize-y"
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description for your profile. Max 500 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
