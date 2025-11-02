// app/api/crop-analysis/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "API configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const photo = formData.get("photo") as File | null;
    const cropType = formData.get("cropType") as string;
    const notes = formData.get("notes") as string;

    // Validate required fields
    if (!photo) {
      return NextResponse.json(
        { error: "Photo is required for crop analysis" },
        { status: 400 }
      );
    }

    if (!cropType) {
      return NextResponse.json(
        { error: "Crop type is required" },
        { status: 400 }
      );
    }

    // Convert File to base64 for Gemini API
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Determine mime type
    const mimeType = photo.type || "image/jpeg";

    // Initialize Gemini model with structured output
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            detectedCrop_en: {
              type: SchemaType.STRING,
              description:
                "The type of crop detected in the image (in English)",
            },
            detectedCrop_ur: {
              type: SchemaType.STRING,
              description:
                "The type of crop detected in the image (in Urdu script)",
            },
            healthStatus: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["Healthy", "At Risk", "Critical"],
              description: "Overall health status of the crop",
            },
            pestDisease_en: {
              type: SchemaType.STRING,
              description:
                "Name of pest or disease detected in English, or 'None' if healthy",
            },
            pestDisease_ur: {
              type: SchemaType.STRING,
              description:
                "Name of pest or disease detected in Urdu script, or 'کوئی نہیں' if healthy",
            },
            diseaseConfidence: {
              type: SchemaType.NUMBER,
              description: "Confidence level of disease detection (0-100)",
            },
            severity: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["None", "Mild", "Moderate", "Severe"],
              description: "Severity level of the issue detected",
            },
            affectedArea_en: {
              type: SchemaType.STRING,
              description:
                "Percentage or description of affected area in English (e.g., '20%', 'Leaves only')",
            },
            affectedArea_ur: {
              type: SchemaType.STRING,
              description:
                "Percentage or description of affected area in Urdu script",
            },
            treatmentPlan_en: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  step: {
                    type: SchemaType.STRING,
                    description:
                      "Step title in English (e.g., 'Immediate Action', 'Week 1-2')",
                  },
                  description: {
                    type: SchemaType.STRING,
                    description:
                      "Detailed description of the treatment step in English",
                  },
                },
                required: ["step", "description"],
              },
              description:
                "Structured treatment plan with steps and descriptions in English",
            },
            treatmentPlan_ur: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  step: {
                    type: SchemaType.STRING,
                    description:
                      "Step title in Urdu script (e.g., 'فوری اقدام', 'ہفتہ 1-2')",
                  },
                  description: {
                    type: SchemaType.STRING,
                    description:
                      "Detailed description of the treatment step in Urdu script",
                  },
                },
                required: ["step", "description"],
              },
              description:
                "Structured treatment plan with steps and descriptions in Urdu script",
            },
            preventiveMeasures_en: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description:
                "List of preventive measures in English to avoid future issues",
            },
            preventiveMeasures_ur: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description:
                "List of preventive measures in Urdu script to avoid future issues",
            },
            estimatedRecoveryTime_en: {
              type: SchemaType.STRING,
              description:
                "Estimated time for recovery in English if treatment is followed",
            },
            estimatedRecoveryTime_ur: {
              type: SchemaType.STRING,
              description:
                "Estimated time for recovery in Urdu script if treatment is followed",
            },
            additionalNotes_en: {
              type: SchemaType.STRING,
              description:
                "Any additional observations or recommendations in English",
            },
            additionalNotes_ur: {
              type: SchemaType.STRING,
              description:
                "Any additional observations or recommendations in Urdu script",
            },
          },
          required: [
            "detectedCrop_en",
            "detectedCrop_ur",
            "healthStatus",
            "pestDisease_en",
            "pestDisease_ur",
            "diseaseConfidence",
            "severity",
            "affectedArea_en",
            "affectedArea_ur",
            "treatmentPlan_en",
            "treatmentPlan_ur",
            "preventiveMeasures_en",
            "preventiveMeasures_ur",
            "estimatedRecoveryTime_en",
            "estimatedRecoveryTime_ur",
            "additionalNotes_en",
            "additionalNotes_ur",
          ],
        },
      },
    });

    // System instruction for crop analysis
    const systemInstruction = `You are an expert agricultural AI assistant specializing in crop health analysis and pest/disease identification. 

Your task is to analyze crop images and provide detailed, accurate assessments in BOTH English and Urdu languages:

IMPORTANT: For all Urdu fields, use actual Urdu script (اردو), NOT Roman Urdu or English transliteration.

1. Identify the type of crop in the image (both English and Urdu)
2. Assess the overall health status (Healthy, At Risk, or Critical)
3. Detect any pests or diseases present (both English and Urdu)
4. Provide confidence level for your disease detection
5. Determine severity level (None, Mild, Moderate, Severe)
6. Estimate the affected area (both English and Urdu)
7. Recommend specific treatment plans as structured steps (both English and Urdu):
   - English: Use headings like "Immediate Action", "Week 1-2", "Follow-up"
   - Urdu: Use headings like "فوری اقدام", "ہفتہ 1-2", "فالو اپ"
8. Suggest preventive measures for future protection (both English and Urdu)
9. Estimate recovery time if treatment is followed (both English and Urdu)
10. Provide any additional relevant observations (both English and Urdu)

For the treatmentPlan fields (both _en and _ur), provide an array of objects with:
- "step": A heading/title for the treatment phase
- "description": Detailed instructions for that step

Be specific, practical, and farmer-friendly in your recommendations. Consider the crop type provided by the farmer: "${cropType}".
${notes ? `Additional context from farmer: "${notes}"` : ""}

CRITICAL: All Urdu text must be in proper Urdu script (اردو رسم الخط), not Roman Urdu. Ensure proper Urdu grammar and agricultural terminology.

Provide your response in a structured JSON format with all required fields in both languages.`;

    // Prepare the prompt
    const prompt = `Analyze this crop image and provide a comprehensive health assessment. The farmer has indicated this is a ${cropType} crop.${
      notes ? ` Additional notes: ${notes}` : ""
    }`;

    // Create image part for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // Call Gemini API
    console.log("Calling Gemini API for crop analysis...");
    const result = await model.generateContent([
      systemInstruction + "\n\n" + prompt,
      imagePart,
    ]);

    const response = await result.response;
    const text = response.text();

    console.log("Gemini API response:", text);

    // Parse the JSON response
    const analysisData = JSON.parse(text);

    // Prepare final response with additional metadata
    const data = {
      detectedCrop: analysisData.detectedCrop_en || cropType,
      detectedCrop_en: analysisData.detectedCrop_en || cropType,
      detectedCrop_ur: analysisData.detectedCrop_ur || cropType,
      healthStatus: analysisData.healthStatus || "Healthy",
      pestDisease: analysisData.pestDisease_en || "None",
      pestDisease_en: analysisData.pestDisease_en || "None",
      pestDisease_ur: analysisData.pestDisease_ur || "کوئی نہیں",
      diseaseConfidence: analysisData.diseaseConfidence || 0,
      severity: analysisData.severity || "None",
      affectedArea: analysisData.affectedArea_en || "N/A",
      affectedArea_en: analysisData.affectedArea_en || "N/A",
      affectedArea_ur: analysisData.affectedArea_ur || "لاگو نہیں",
      treatmentPlan: analysisData.treatmentPlan_en || [
        {
          step: "No Treatment Required",
          description:
            "Crop appears healthy. Continue regular monitoring and maintenance.",
        },
      ],
      treatmentPlan_en: analysisData.treatmentPlan_en || [
        {
          step: "No Treatment Required",
          description:
            "Crop appears healthy. Continue regular monitoring and maintenance.",
        },
      ],
      treatmentPlan_ur: analysisData.treatmentPlan_ur || [
        {
          step: "علاج کی ضرورت نہیں",
          description:
            "فصل صحت مند نظر آتی ہے۔ باقاعدہ نگرانی اور دیکھ بھال جاری رکھیں۔",
        },
      ],
      preventiveMeasures: analysisData.preventiveMeasures_en || [],
      preventiveMeasures_en: analysisData.preventiveMeasures_en || [],
      preventiveMeasures_ur: analysisData.preventiveMeasures_ur || [],
      estimatedRecoveryTime: analysisData.estimatedRecoveryTime_en || "N/A",
      estimatedRecoveryTime_en: analysisData.estimatedRecoveryTime_en || "N/A",
      estimatedRecoveryTime_ur:
        analysisData.estimatedRecoveryTime_ur || "لاگو نہیں",
      additionalNotes: analysisData.additionalNotes_en || "",
      additionalNotes_en: analysisData.additionalNotes_en || "",
      additionalNotes_ur: analysisData.additionalNotes_ur || "",
      analysis: {
        confidence: analysisData.diseaseConfidence || 0,
        uploadedAt: new Date().toISOString(),
        notes: notes || "",
        modelUsed: "gemini-2.0-flash-exp",
      },
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error processing crop analysis:", error);

    // Handle specific error types
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid API key configuration" },
        { status: 500 }
      );
    }

    if (error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to analyze crop",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
