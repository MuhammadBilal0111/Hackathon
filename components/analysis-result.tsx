"use client";

import { useState, useEffect } from "react";
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

interface TreatmentStep {
  step: string;
  description: string;
}

interface AnalysisResultsProps {
  detectedCrop: string;
  healthStatus: "Healthy" | "At Risk" | "Critical";
  pestDisease: string;
  diseaseConfidence: number;
  severity: "None" | "Mild" | "Moderate" | "Severe";
  affectedArea: string;
  treatmentPlan: TreatmentStep[];
  preventiveMeasures: string[];
  estimatedRecoveryTime: string;
  additionalNotes: string;
  // Bilingual support
  detectedCrop_en?: string;
  detectedCrop_ur?: string;
  pestDisease_en?: string;
  pestDisease_ur?: string;
  affectedArea_en?: string;
  affectedArea_ur?: string;
  treatmentPlan_en?: TreatmentStep[];
  treatmentPlan_ur?: TreatmentStep[];
  preventiveMeasures_en?: string[];
  preventiveMeasures_ur?: string[];
  estimatedRecoveryTime_en?: string;
  estimatedRecoveryTime_ur?: string;
  additionalNotes_en?: string;
  additionalNotes_ur?: string;
  onSave: () => void;
  onAskAI: () => void;
  isLoading?: boolean;
}

export function AnalysisResults({
  detectedCrop,
  healthStatus,
  pestDisease,
  diseaseConfidence,
  severity,
  affectedArea,
  treatmentPlan,
  preventiveMeasures,
  estimatedRecoveryTime,
  additionalNotes,
  detectedCrop_en,
  detectedCrop_ur,
  pestDisease_en,
  pestDisease_ur,
  affectedArea_en,
  affectedArea_ur,
  treatmentPlan_en,
  treatmentPlan_ur,
  preventiveMeasures_en,
  preventiveMeasures_ur,
  estimatedRecoveryTime_en,
  estimatedRecoveryTime_ur,
  additionalNotes_en,
  additionalNotes_ur,
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
  console.log(
    detectedCrop_en,
    detectedCrop_ur,
    pestDisease_en,
    pestDisease_ur,
    affectedArea_en,
    affectedArea_ur,
    treatmentPlan_en,
    treatmentPlan_ur,
    preventiveMeasures_en,
    preventiveMeasures_ur,
    estimatedRecoveryTime_en,
    estimatedRecoveryTime_ur,
    additionalNotes_en,
    additionalNotes_ur
  );
  // Helper to get content based on selected language
  const isUrdu = selectedLanguage === "ur-PK";
  const currentDetectedCrop =
    isUrdu && detectedCrop_ur
      ? detectedCrop_ur
      : detectedCrop_en || detectedCrop;
  const currentPestDisease =
    isUrdu && pestDisease_ur ? pestDisease_ur : pestDisease_en || pestDisease;
  const currentAffectedArea =
    isUrdu && affectedArea_ur
      ? affectedArea_ur
      : affectedArea_en || affectedArea;
  const currentTreatmentPlan =
    isUrdu && treatmentPlan_ur
      ? treatmentPlan_ur
      : treatmentPlan_en || treatmentPlan;
  const currentPreventiveMeasures =
    isUrdu && preventiveMeasures_ur
      ? preventiveMeasures_ur
      : preventiveMeasures_en || preventiveMeasures;
  const currentEstimatedRecoveryTime =
    isUrdu && estimatedRecoveryTime_ur
      ? estimatedRecoveryTime_ur
      : estimatedRecoveryTime_en || estimatedRecoveryTime;
  const currentAdditionalNotes =
    isUrdu && additionalNotes_ur
      ? additionalNotes_ur
      : additionalNotes_en || additionalNotes;

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
      setIsSpeaking(false);
    }
  };

  const speakInUrdu = async () => {
    if (!speechSupported || typeof window === "undefined") {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

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

    // All four labels to speak in Urdu - Build complete text
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
        pestDisease === "None" ? romanUrduTranslations["None"] : pestDisease;

      fullText = `
${romanUrduTranslations["Detected Crop"]}: ${detectedCrop}.
${romanUrduTranslations["Health Status"]}: ${healthStatusValue}.
${romanUrduTranslations["Identified Pest/Disease"]}: ${pestValue}.
${romanUrduTranslations["Recommended Treatment Plan"]}: ${treatmentPlan}.
`.trim();
    }

    console.log("Speaking Urdu text:", fullText);

    try {
      // Speak all text at once - no delays
      await speakSingleUtterance(
        fullText,
        urduVoice,
        urduVoice ? urduVoice.lang : "ur-PK",
        undefined
      );

      setIsSpeaking(false);
    } catch (error) {
      console.error("Error during Urdu speech:", error);
      setIsSpeaking(false);
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
    {
      label: isUrdu ? "پہچانی گئی فصل" : "Detected Crop",
      value: currentDetectedCrop,
      color: "text-green-700",
    },
    {
      label: isUrdu ? "صحت کی حالت" : "Health Status",
      value: healthStatus,
      icon: getHealthStatusIcon(healthStatus),
    },
    {
      label: isUrdu ? "شناخت شدہ کیڑا یا بیماری" : "Identified Pest/Disease",
      value: currentPestDisease,
      badge:
        diseaseConfidence > 0
          ? `${diseaseConfidence}% ${isUrdu ? "اعتماد" : "confidence"}`
          : undefined,
    },
    {
      label: isUrdu ? "شدت کی سطح" : "Severity Level",
      value: severity,
      color:
        severity === "Severe"
          ? "text-red-600"
          : severity === "Moderate"
          ? "text-orange-600"
          : severity === "Mild"
          ? "text-yellow-600"
          : "text-green-600",
    },
    {
      label: isUrdu ? "متاثرہ علاقہ" : "Affected Area",
      value: currentAffectedArea,
    },
    {
      label: isUrdu ? "متوقع بحالی کا وقت" : "Estimated Recovery Time",
      value: currentEstimatedRecoveryTime,
      color: "text-blue-700",
    },
  ];
  console.log("PLan", currentTreatmentPlan, isUrdu, treatmentPlan_ur);

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
      Urdu Voice Info - Only show if Urdu selected
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
            <div className="flex items-start gap-2">
              {item.icon && <div className="mt-0.5">{item.icon}</div>}
              <div className="flex-1">
                <p
                  className={`text-base font-semibold ${
                    item.color || "text-foreground"
                  }`}
                >
                  {item.value}
                </p>
                {item.badge && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Treatment Plan Section */}
      {currentTreatmentPlan && currentTreatmentPlan.length > 0 && (
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {isUrdu
              ? "تجویز کردہ علاج کا منصوبہ"
              : "Recommended Treatment Plan"}
          </h3>
          <div className="space-y-4">
            {currentTreatmentPlan.map((treatment, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-700 mb-2">
                  {treatment.step}
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {treatment.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
      {/* Preventive Measures Section */}
      {currentPreventiveMeasures && currentPreventiveMeasures.length > 0 && (
        <Card className="p-4 bg-card border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            {isUrdu ? "احتیاطی تدابیر" : "Preventive Measures"}
          </p>
          <ul className="space-y-2">
            {currentPreventiveMeasures.map((measure, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>{measure}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {/* Additional Notes Section */}
      {currentAdditionalNotes && currentAdditionalNotes.trim() !== "" && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">
            {isUrdu ? "اضافی نوٹس" : "Additional Notes"}
          </p>
          <p className="text-sm text-blue-800">{currentAdditionalNotes}</p>
        </Card>
      )}
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
