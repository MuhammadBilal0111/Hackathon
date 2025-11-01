"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Languages,
} from "lucide-react";

interface AnalysisResultsProps {
  detectedCrop: string;
  healthStatus: "Healthy" | "At Risk" | "Critical";
  pestDisease: string;
  treatmentPlan: string;
  onSave: () => void;
  onAskAI: () => void;
  isLoading?: boolean;
}

export function AnalysisResults({
  detectedCrop,
  healthStatus,
  pestDisease,
  treatmentPlan,
  onSave,
  onAskAI,
  isLoading = false,
}: AnalysisResultsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [hasUrduVoice, setHasUrduVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Check if Urdu or Hindi voice is available (Hindi can pronounce Urdu well)
      const urduVoiceExists = voices.some(
        (voice) =>
          voice.lang.toLowerCase().startsWith("ur") ||
          voice.lang.toLowerCase().includes("ur-pk") ||
          voice.lang.toLowerCase().includes("ur_pk") ||
          voice.lang.toLowerCase().includes("hi-in") ||
          voice.lang.toLowerCase().includes("hi_in")
      );
      setHasUrduVoice(urduVoiceExists);

      console.log(
        "Available voices:",
        voices.map((v) => `${v.lang} - ${v.name}`)
      );
      if (urduVoiceExists) {
        const voiceType = voices.find((v) =>
          v.lang.toLowerCase().startsWith("ur")
        )
          ? "Urdu"
          : "Hindi (Urdu-compatible)";
        console.log(`✅ ${voiceType} voice detected!`);
      } else {
        console.warn(
          "⚠️ No Urdu/Hindi voice found. Will use Roman Urdu with English pronunciation."
        );
      }
    };

    // Load voices immediately
    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "At Risk":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "Critical":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  // Urdu translations - Accurate translations
  const urduTranslations: Record<string, string> = {
    "Detected Crop": "پہچانی گئی فصل",
    "Health Status": "صحت کی حالت",
    "Identified Pest/Disease": "شناخت شدہ کیڑا یا بیماری",
    "Recommended Treatment Plan": "تجویز کردہ علاج کا منصوبہ",
    Healthy: "صحت مند",
    "At Risk": "خطرے میں",
    Critical: "نازک",
    None: "کوئی نہیں",
  };

  // Roman Urdu fallback for non-Urdu voices
  const romanUrduTranslations: Record<string, string> = {
    "Detected Crop": "Pehchani gayi fasal",
    "Health Status": "Sehat ki halat",
    "Identified Pest/Disease": "Shanakht shuda keera ya beemari",
    "Recommended Treatment Plan": "Tajweez karda ilaaj ka mansuba",
    Healthy: "Sehatmand",
    "At Risk": "Khatre mein",
    Critical: "Naazuk",
    None: "Koi nahin",
  };

  const speakSingleUtterance = (
    text: string,
    voice: SpeechSynthesisVoice | null,
    lang: string,
    onEnd?: () => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        onEnd?.();
        resolve();
      };

      utterance.onerror = (error) => {
        console.error("Speech error:", error);
        reject(error);
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();

      // Stop and cleanup audio if it's playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      setIsSpeaking(false);
    }
  };

  const speakInUrdu = async () => {
    if (typeof window === "undefined") {
      return;
    }

    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(true);

    // Build English text to send to Sarvam AI for translation and speech
    const englishText = `
Detected Crop: ${detectedCrop}.
Health Status: ${healthStatus}.
Identified Pest or Disease: ${pestDisease}.
Recommended Treatment Plan: ${treatmentPlan}.
`.trim();

    console.log("Converting English text to Hindi/Urdu speech:", englishText);

    try {
      // Call Sarvam AI API for text-to-speech
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: englishText,
          targetLanguage: "hi-IN", // Hindi - Sarvam AI supports hi-IN
        }),
      });

      const data = await response.json();

      if (response.ok && data.audio && data.success) {
        console.log("✅ Sarvam AI audio received, playing...");

        // Play the audio from Sarvam AI
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audioRef.current = audio; // Store reference for stopping

        audio.onended = () => {
          console.log("Audio playback completed");
          setIsSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = (error) => {
          console.error("Audio playback error:", error);
          audioRef.current = null;
          // Fallback to browser TTS
          useBrowserUrduTTS();
        };

        await audio.play();
      } else {
        // Fallback to browser TTS if API fails
        console.log("⚠️ Sarvam AI not available, using browser TTS fallback");
        useBrowserUrduTTS();
      }
    } catch (error) {
      console.error("Error during Sarvam AI speech:", error);
      // Fallback to browser TTS
      useBrowserUrduTTS();
    }

    // Browser TTS fallback function
    async function useBrowserUrduTTS() {
      if (!speechSupported) {
        alert("Text-to-speech is not supported in your browser.");
        setIsSpeaking(false);
        return;
      }

      try {
        // Find Urdu voice, then try Hindi voice as fallback
        let urduVoice =
          availableVoices.find((v) => v.lang.toLowerCase().startsWith("ur")) ||
          null;

        // If no Urdu voice, try Hindi (similar pronunciation)
        if (!urduVoice) {
          urduVoice =
            availableVoices.find(
              (v) =>
                v.lang.toLowerCase().includes("hi-in") ||
                v.lang.toLowerCase().includes("hi_in")
            ) || null;
        }

        // Only show alert on first click if no voice found
        if (!urduVoice && !sessionStorage.getItem("urdu-voice-warning-shown")) {
          sessionStorage.setItem("urdu-voice-warning-shown", "true");
          console.log(
            "💡 Tip: For authentic Urdu accent, install Urdu language pack from system settings. Currently using Roman Urdu pronunciation."
          );
        }

        // Use proper Urdu script when Urdu voice is available, otherwise use Roman Urdu
        let fullText: string;

        if (urduVoice) {
          // Authentic Urdu with Urdu script
          const healthStatusValue = urduTranslations[healthStatus];
          const pestValue =
            pestDisease === "None" ? urduTranslations["None"] : pestDisease;

          fullText = `
${urduTranslations["Detected Crop"]}: ${detectedCrop}۔
${urduTranslations["Health Status"]}: ${healthStatusValue}۔
${urduTranslations["Identified Pest/Disease"]}: ${pestValue}۔
${urduTranslations["Recommended Treatment Plan"]}: ${treatmentPlan}۔
`.trim();
        } else {
          // Roman Urdu fallback for English-speaking voices
          const healthStatusValue = romanUrduTranslations[healthStatus];
          const pestValue =
            pestDisease === "None"
              ? romanUrduTranslations["None"]
              : pestDisease;

          fullText = `
${romanUrduTranslations["Detected Crop"]}: ${detectedCrop}.
${romanUrduTranslations["Health Status"]}: ${healthStatusValue}.
${romanUrduTranslations["Identified Pest/Disease"]}: ${pestValue}.
${romanUrduTranslations["Recommended Treatment Plan"]}: ${treatmentPlan}.
`.trim();
        }

        console.log("Speaking Urdu text (browser fallback):", fullText);

        await speakSingleUtterance(
          fullText,
          urduVoice,
          urduVoice ? urduVoice.lang : "ur-PK",
          undefined
        );

        setIsSpeaking(false);
      } catch (err) {
        console.error("Browser TTS error:", err);
        setIsSpeaking(false);
      }
    }
  };

  const speakInEnglish = async () => {
    if (!speechSupported || typeof window === "undefined") {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    // Find English voice - prioritize en-US, then en-GB
    const englishVoice =
      availableVoices.find((v) => v.lang.startsWith("en-US")) ||
      availableVoices.find((v) => v.lang.startsWith("en-GB")) ||
      availableVoices.find((v) => v.lang.startsWith("en")) ||
      null;

    // Build complete English text - all 4 fields with proper formatting
    const fullText = `
Detected Crop: ${detectedCrop}.
Health Status: ${healthStatus}.
Identified Pest or Disease: ${pestDisease}.
Recommended Treatment Plan: ${treatmentPlan}.
`.trim();

    console.log("Speaking English text:", fullText);

    try {
      // Speak all text at once - no delays
      await speakSingleUtterance(fullText, englishVoice, "en-US", undefined);

      setIsSpeaking(false);
    } catch (error) {
      console.error("Error during English speech:", error);
      setIsSpeaking(false);
    }
  };

  const speakAllResults = () => {
    if (selectedLanguage === "ur-PK") {
      speakInUrdu();
    } else {
      speakInEnglish();
    }
  };

  const resultItems = [
    { label: "Detected Crop", value: detectedCrop, color: "text-green-700" },
    {
      label: "Health Status",
      value: healthStatus,
      icon: getHealthStatusIcon(healthStatus),
    },
    { label: "Identified Pest/Disease", value: pestDisease },
    {
      label: "Recommended Treatment Plan",
      value: treatmentPlan,
      color: "text-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Language Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>

        {/* Language and Speech Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">🇬🇧 English</SelectItem>
                <SelectItem value="ur-PK">🇵🇰 اردو (Urdu)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {speechSupported && (
            <Button
              onClick={isSpeaking ? stopSpeaking : speakAllResults}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!availableVoices.length}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Read Aloud
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-pulse">
          <Volume2 className="w-5 h-5 text-green-600 animate-bounce" />
          <span className="text-sm font-medium text-green-700">
            {selectedLanguage === "ur-PK"
              ? "Speaking in Urdu..."
              : "Speaking in English..."}
          </span>
        </div>
      )}

      {/* Urdu Voice Info - Only show if Urdu selected */}
      {selectedLanguage === "ur-PK" && !hasUrduVoice && !isSpeaking && (
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-2xl">💡</div>
          <div className="flex-1 text-sm text-blue-700">
            <p className="font-medium">Using Roman Urdu pronunciation</p>
            <p className="text-xs mt-1">
              For authentic Urdu accent, install Urdu language pack from your
              system settings.
              <br />
              <span className="text-blue-600 font-medium mt-1 inline-block">
                The audio will still be understandable in Urdu context.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resultItems.map((item, index) => (
          <Card key={index} className="p-4 bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {item.label}
            </p>
            <div className="flex items-center gap-2">
              {item.icon && <div>{item.icon}</div>}
              <p
                className={`text-base font-semibold ${
                  item.color || "text-foreground"
                }`}
              >
                {item.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Save Result
        </Button>
        <Button onClick={onAskAI} disabled={isLoading} variant="outline">
          Ask AI
        </Button>
      </div>
    </div>
  );
}
