import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@repo/database";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Validation schema for hero creation
const heroSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  systemPrompt: z.string().optional(),
  modelName: z.string().min(1, { message: "Model is required" }),
  avatarUrl: z.string().optional(),
});

// Ollama API client for creating models
async function createOllamaModel(modelName: string, baseModel: string, systemPrompt: string) {
  try {
    const response = await fetch("http://localhost:11434/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        from: baseModel,
        system: systemPrompt || `You are ${modelName}, a helpful AI assistant.`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ollama API error: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Ollama model:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    
    const validationResult = heroSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validationResult.error.flatten() },
        { status: 400 }
      );
    }
    
    const { name, description, systemPrompt, modelName, avatarUrl } = validationResult.data;

    // Create the hero in the database
    const hero = await prisma.hero.create({
      data: {
        name,
        description,
        systemPrompt,
        modelName,
        avatarUrl: avatarUrl || null,
      },
    });

    // Create a custom model in Ollama
    // Using hero's name as model name (sanitized for Ollama naming conventions)
    const ollamaModelName = `hero-${hero.id.toLowerCase().replace(/[^a-z0-9-_]/g, "-")}`;
    
    try {
      // Create a model in Ollama based on llama3.2:latest
      await createOllamaModel(
        ollamaModelName,
        "llama3.2:latest", // Base model as specified in the requirements
        systemPrompt || `You are ${name}, ${description || "a helpful AI assistant."}`
      );

      // Update the hero record with the Ollama model name
      await prisma.hero.update({
        where: { id: hero.id },
        data: { modelName: ollamaModelName }
      });

      return NextResponse.json(
        { 
          ...hero, 
          modelName: ollamaModelName,
          message: "Hero created successfully with custom Ollama model" 
        }, 
        { status: 201 }
      );
    } catch (ollamaError) {
      console.error("Failed to create Ollama model:", ollamaError);
      // Still return success for the hero creation, but with a warning
      return NextResponse.json(
        { 
          ...hero, 
          warning: "Hero created in database, but failed to create custom Ollama model" 
        }, 
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating hero:", error);
    return NextResponse.json(
      { message: "Failed to create hero" },
      { status: 500 }
    );
  }
}