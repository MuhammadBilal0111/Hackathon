// app/api/weather/gemini-tips/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

    // Parse the request body
    const body = await request.json();
    const { weatherData, location } = body;

    if (!weatherData) {
      return NextResponse.json(
        { error: "Weather data is required" },
        { status: 400 }
      );
    }

    // Initialize Gemini model with structured output
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary_en: {
              type: SchemaType.STRING,
              description:
                "Brief overview of the weather conditions and overall farming outlook in English (2-3 sentences)",
            },
            summary_ur: {
              type: SchemaType.STRING,
              description:
                "Brief overview of the weather conditions and overall farming outlook in Urdu script (2-3 sentences)",
            },
            sections: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  heading_en: {
                    type: SchemaType.STRING,
                    description:
                      "Section heading in English (e.g., 'Immediate Actions', 'Irrigation Management')",
                  },
                  heading_ur: {
                    type: SchemaType.STRING,
                    description:
                      "Section heading in Urdu script (e.g., 'فوری اقدامات', 'آبپاشی کا انتظام')",
                  },
                  content_en: {
                    type: SchemaType.STRING,
                    description:
                      "Detailed content for this section with actionable advice in English",
                  },
                  content_ur: {
                    type: SchemaType.STRING,
                    description:
                      "Detailed content for this section with actionable advice in Urdu script",
                  },
                  priority: {
                    type: SchemaType.STRING,
                    format: "enum",
                    enum: ["high", "medium", "low"],
                    description: "Priority level for this action",
                  },
                  subsections: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        subheading_en: {
                          type: SchemaType.STRING,
                          description: "Subsection title in English",
                        },
                        subheading_ur: {
                          type: SchemaType.STRING,
                          description: "Subsection title in Urdu script",
                        },
                        text_en: {
                          type: SchemaType.STRING,
                          description: "Subsection content in English",
                        },
                        text_ur: {
                          type: SchemaType.STRING,
                          description: "Subsection content in Urdu script",
                        },
                      },
                      required: [
                        "subheading_en",
                        "subheading_ur",
                        "text_en",
                        "text_ur",
                      ],
                    },
                    description:
                      "Optional nested subsections for more detailed information",
                  },
                },
                required: [
                  "heading_en",
                  "heading_ur",
                  "content_en",
                  "content_ur",
                  "priority",
                ],
              },
              description:
                "Array of recommendation sections organized by topic",
            },
            alerts: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  type: {
                    type: SchemaType.STRING,
                    format: "enum",
                    enum: ["warning", "caution", "info"],
                    description: "Alert severity level",
                  },
                  message_en: {
                    type: SchemaType.STRING,
                    description: "Alert message in English",
                  },
                  message_ur: {
                    type: SchemaType.STRING,
                    description: "Alert message in Urdu script",
                  },
                },
                required: ["type", "message_en", "message_ur"],
              },
              description:
                "Critical alerts or warnings based on weather conditions",
            },
          },
          required: ["summary_en", "summary_ur", "sections", "alerts"],
        },
      },
    });

    // Build a comprehensive prompt with weather data
    const prompt = `You are an expert agricultural advisor specializing in weather-based farming recommendations for Pakistani farmers.

Based on the following weather conditions for ${
      location || "the farm location"
    }, provide a comprehensive farming mitigation and action plan in BOTH English and Urdu:

CURRENT WEATHER:
- Temperature: ${weatherData.current.temperature}°C
- Humidity: ${weatherData.current.humidity}%
- Wind Speed: ${weatherData.current.windSpeed} km/h
- Condition: ${weatherData.current.condition}
${weatherData.current.uv ? `- UV Index: ${weatherData.current.uv}` : ""}
${
  weatherData.current.precip_mm !== null
    ? `- Precipitation: ${weatherData.current.precip_mm} mm`
    : ""
}

3-DAY FORECAST:
${weatherData.forecast
  .map(
    (day: any, idx: number) =>
      `${day.day}: ${day.temperature}°C, ${day.condition}`
  )
  .join("\n")}

TEMPERATURE RANGE: ${weatherData.temperatureRange.min}°C - ${
      weatherData.temperatureRange.max
    }°C

IMPORTANT: Provide ALL content in BOTH English and Urdu script (اردو). Use proper Urdu script, NOT Roman Urdu.

Provide a structured response with:

1. **Summary** (summary_en and summary_ur): Brief 2-3 sentence overview in both languages

2. **Sections**: Organize recommendations into 5-7 clear sections with:
   - heading_en: Section title in English
   - heading_ur: Section title in Urdu script
   - content_en: Detailed, actionable advice in English (3-5 sentences)
   - content_ur: Detailed, actionable advice in Urdu script (3-5 sentences)
   - Priority: "high", "medium", or "low"
   - Subsections (optional): For complex topics with:
     - subheading_en: Subsection title in English
     - subheading_ur: Subsection title in Urdu script
     - text_en: Content in English
     - text_ur: Content in Urdu script

   Suggested sections:
   - Immediate Actions / فوری اقدامات (next 24-48 hours)
   - Crop Protection & Management / فصل کی حفاظت اور انتظام
   - Irrigation & Water Management / آبپاشی اور پانی کا انتظام
   - Pest & Disease Prevention / کیڑے اور بیماریوں سے بچاؤ
   - Soil Management / مٹی کا انتظام
   - Crop-Specific Advice / فصل کے لیے خاص مشورے (wheat/گندم, rice/چاول, cotton/کپاس, vegetables/سبزیاں)
   - Preparation for Forecast / پیشن گوئی کے لیے تیاری

3. **Alerts** (alerts): 0-3 critical warnings with:
   - Type: "warning" (critical), "caution" (important), or "info" (helpful)
   - message_en: Alert in English
   - message_ur: Alert in Urdu script

Keep all advice:
- Practical and immediately actionable
- Specific to Pakistani farming context
- Simple language, farmer-friendly
- Include specific timing and measurements
- Use proper Urdu agricultural terminology

CRITICAL: All Urdu text MUST be in proper Urdu script (اردو رسم الخط), not Roman Urdu. Ensure proper Urdu grammar.`;

    // Call Gemini API
    console.log(
      "Calling Gemini API for bilingual structured weather-based farming tips..."
    );
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API structured response received");

    // Parse the JSON response
    const structuredTips = JSON.parse(text);

    return NextResponse.json({
      tips: structuredTips,
      generatedAt: new Date().toISOString(),
      location: location || "Unknown",
    });
  } catch (error: any) {
    console.error("Error generating Gemini tips:", error);

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
        error: "Failed to generate farming tips",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
