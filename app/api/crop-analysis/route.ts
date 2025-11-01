// app/api/crop-analysis/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    crop: "Wheat",
    healthStatus: "Good",
    pestDetected: false,
    recommendation: "Continue regular irrigation schedule.",
  };

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const photo = formData.get("photo");
    const cropType = formData.get("cropType");
    const notes = formData.get("notes");

    
    // Mock response - in production, this would analyze the actual image
    const data = {
      detectedCrop: cropType || "Corn",
      healthStatus: "Healthy",
      pestDisease: "None",
      treatmentPlan:
        "No treatment required. Continue with regular monitoring and maintenance.",
      analysis: {
        confidence: 95,
        uploadedAt: new Date().toISOString(),
        notes: notes || "",
      },
    };

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing crop analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze crop" },
      { status: 500 }
    );
  }
}
