import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// API configuration from environment variables
const SPEECHACTORS_API_KEY = process.env.SPEECHACTOR_TTS as string;
const SPEECHACTORS_GENERATE_URL = process.env.SPEECHACTORS_API_URL as string;
const GOOGLE_TRANSLATE_URL = process.env.GOOGLE_TRANSLATE_API_URL as string;

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = "ur-PK" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!SPEECHACTORS_API_KEY) {
      return NextResponse.json(
        {
          error:
            "SpeechActors API key not configured. Please set NEXT_PUBLIC_SPEECHACTOR_TTS environment variable.",
          fallback: true,
        },
        { status: 503 }
      );
    }

    // Step 1: Translate English text to Urdu using Google Translate API
    let urduText = text;
    try {
      const translateResponse = await axios.get(GOOGLE_TRANSLATE_URL, {
        params: {
          client: "gtx",
          sl: "en", // Source: English
          tl: "ur", // Target: Urdu
          dt: "t",
          q: text,
        },
        timeout: 10000,
      });

      if (translateResponse.data && translateResponse.data[0]) {
        // Google Translate returns array of translations
        urduText = translateResponse.data[0]
          .map((item: any) => item[0])
          .join("");
      }
    } catch (translateError: any) {
      console.error("Translation failed:", translateError.message);
      // Fallback: use original English text if translation fails
    }

    // Step 2: Convert Urdu text to speech using SpeechActors API
    try {
      // Configure SpeechActors API request with Urdu (Pakistan) voice
      const requestPayload = {
        locale: "ur-PK", // Urdu (Pakistan)
        vid: "ur-PK-AsadNeural", // Asad voice for Urdu
        text: urduText, // Translated Urdu text
        speakingRate: 0, // Default speed
        pitch: 0, // Default pitch
      };

      const response = await axios.post(
        SPEECHACTORS_GENERATE_URL,
        requestPayload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${SPEECHACTORS_API_KEY}`,
          },
          responseType: "arraybuffer", // Response is raw MP3 audio file
          timeout: 30000,
        }
      );

      // Convert MP3 audio buffer to base64 for transmission
      const audioBase64 = Buffer.from(response.data).toString("base64");

      return NextResponse.json({
        audio: audioBase64,
        contentType: "audio/mpeg",
        success: true,
        translatedText: urduText, // Include translated text in response
      });
    } catch (apiError: any) {
      console.error("SpeechActors API Error:", apiError.message);

      return NextResponse.json(
        {
          error: "SpeechActors API failed. Using fallback browser TTS.",
          fallback: true,
          details: apiError.response?.data || apiError.message,
        },
        { status: apiError.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected Error:", error.message);

    return NextResponse.json(
      {
        error: error.message || "Failed to process request",
        fallback: true,
      },
      { status: 500 }
    );
  }
}
