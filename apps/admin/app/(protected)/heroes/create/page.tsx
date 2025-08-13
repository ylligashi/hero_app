"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  systemPrompt: z.string().optional(),
  modelName: z.string().min(1, { message: "Model is required" }),
  avatarUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Default values for the form
const defaultValues: Partial<FormValues> = {
  name: "",
  description: "",
  systemPrompt: "",
  modelName: "llama3.2:latest",
  avatarUrl: "",
};

export default function CreateHeroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Setup react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Form submission handler
  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/heroes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create hero");
      }


      router.push("/heroes");
      router.refresh();
    } catch (error) {
      console.error("Error creating hero:", error);

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Hero</h1>
          <p className="text-muted-foreground">
            Add a new AI personality for your users
          </p>
        </div>
        <div>
          <Button variant="outline" asChild>
            <Link href="/heroes">Cancel</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Details</CardTitle>
          <CardDescription>
            Enter information about the hero character
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Einstein" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your hero character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="The brilliant physicist who will explain complex concepts in simple terms" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the hero's personality
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="You are Albert Einstein, the legendary physicist..." 
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Instructions for the AI model on how to behave as this character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="llama3.2:latest">Llama 3.2</SelectItem>
                        <SelectItem value="mistral:latest">Mistral</SelectItem>
                        <SelectItem value="codellama:latest">Code Llama</SelectItem>
                        <SelectItem value="phi3:latest">Phi-3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The Ollama model to use for this hero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to an image for this hero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/heroes">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Hero"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}