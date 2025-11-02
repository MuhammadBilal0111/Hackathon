// app/api/annual-plan/generate/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { tavily } from "@tavily/core";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Initialize Tavily API
const tvly = tavily({ apiKey: process.env.TAVILY_KEY || "" });

export async function POST(request: Request) {
  try {
    // Validate API keys
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Gemini API configuration error. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    if (!process.env.TAVILY_KEY) {
      console.error("TAVILY_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Tavily API configuration error. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const {
      location,
      farmSize,
      soilType,
      primaryCrops,
      experienceLevel,
      availableResources,
      farmingGoals,
      waterAvailability,
      farmingType,
    } = body;

    // Validate required fields
    if (
      !location ||
      !farmSize ||
      !soilType ||
      !primaryCrops ||
      primaryCrops.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide all required fields: location, farm size, soil type, and at least one crop.",
        },
        { status: 400 }
      );
    }

    console.log("📡 Fetching location data from Tavily...");

    // Step 1: Fetch location-specific data from Tavily
    const tavilyQuery = `Agricultural information for ${location}: weather patterns, soil conditions, climate data, best farming practices, seasonal rainfall, temperature ranges, and crop suitability for ${primaryCrops.join(
      ", "
    )}`;

    const tavilyResponse = await tvly.search(tavilyQuery, {
      maxResults: 5,
      searchDepth: "advanced",
      includeAnswer: true,
    });

    console.log("✅ Tavily data fetched successfully");

    // Extract relevant information from Tavily
    const locationContext = {
      summary: tavilyResponse.answer || "No specific information available",
      sources: tavilyResponse.results.map((result: any) => ({
        title: result.title,
        content: result.content,
        url: result.url,
      })),
    };

    console.log("🤖 Generating annual plan with Gemini...");

    // Step 2: Create system prompt for Gemini
    const systemPrompt = `You are an expert agricultural advisor with deep knowledge of farming practices, crop management, and seasonal planning. 

You will receive information about a farmer's location, farm specifications, and research data about their region. Your task is to create a comprehensive, month-by-month annual farming plan.

CONTEXT INFORMATION:
- Location: ${location}
- Farm Size: ${farmSize}
- Soil Type: ${soilType}
- Primary Crops: ${primaryCrops.join(", ")}
- Experience Level: ${experienceLevel || "Not specified"}
- Available Resources: ${availableResources || "Not specified"}
- Farming Goals: ${farmingGoals || "General sustainable farming"}
- Water Availability: ${waterAvailability || "Not specified"}
- Farming Type: ${farmingType || "Traditional"}

LOCATION RESEARCH DATA:
${locationContext.summary}

KEY FINDINGS FROM RESEARCH:
${locationContext.sources
  .map(
    (source: any, idx: number) =>
      `${idx + 1}. ${source.title}: ${source.content.substring(0, 200)}...`
  )
  .join("\n")}

Create a detailed annual farming plan with activities for each month. Consider:
1. Local climate and weather patterns
2. Optimal planting and harvesting times for the specified crops
3. Soil preparation and fertilization schedules
4. Irrigation management based on seasonal rainfall
5. Pest and disease prevention strategies
6. Market timing for better prices
7. Resource optimization based on available resources

Provide practical, actionable tasks that are specific to the location and crops mentioned.`;

    // Initialize Gemini model with structured output
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            farmInfo: {
              type: SchemaType.OBJECT,
              properties: {
                location: { type: SchemaType.STRING },
                farmSize: { type: SchemaType.STRING },
                soilType: { type: SchemaType.STRING },
                primaryCrops: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
              },
              required: ["location", "farmSize", "soilType", "primaryCrops"],
            },
            annualPlan: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  month: {
                    type: SchemaType.STRING,
                    description: "Month name (e.g., January, February)",
                  },
                  activities: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        title: {
                          type: SchemaType.STRING,
                          description: "Title of the farming activity",
                        },
                        description: {
                          type: SchemaType.STRING,
                          description: "Detailed description of what to do",
                        },
                        priority: {
                          type: SchemaType.STRING,
                          format: "enum",
                          enum: ["High", "Medium", "Low"],
                          description: "Priority level of the task",
                        },
                        estimatedDuration: {
                          type: SchemaType.STRING,
                          description: "How long the activity will take",
                        },
                        status: {
                          type: SchemaType.STRING,
                          format: "enum",
                          enum: ["pending", "completed"],
                          description: "Current status of the activity",
                        },
                      },
                      required: [
                        "title",
                        "description",
                        "priority",
                        "estimatedDuration",
                        "status",
                      ],
                    },
                  },
                },
                required: ["month", "activities"],
              },
            },
            seasonalTips: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  season: { type: SchemaType.STRING },
                  tips: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                  },
                },
                required: ["season", "tips"],
              },
            },
            criticalDates: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  date: { type: SchemaType.STRING },
                  event: { type: SchemaType.STRING },
                  description: { type: SchemaType.STRING },
                },
                required: ["date", "event", "description"],
              },
            },
          },
          required: ["farmInfo", "annualPlan", "seasonalTips", "criticalDates"],
        },
      },
    });

    // Generate the plan
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    const annualPlanData = JSON.parse(responseText);

    console.log("✅ Annual plan generated successfully");

    // Return the complete response
    return NextResponse.json({
      success: true,
      data: {
        ...annualPlanData,
        generatedAt: new Date().toISOString(),
        tavilyContext: locationContext,
      },
    });
  } catch (error: any) {
    console.error("❌ Error generating annual plan:", error);

    // Detailed error logging
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.response) {
      console.error("Error response:", error.response);
    }

    return NextResponse.json(
      {
        error: "Failed to generate annual plan. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
