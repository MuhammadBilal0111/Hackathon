export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface ForecastDay {
  day: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface TemperatureRange {
  min: number;
  max: number;
}

export interface GeminiTipsSubsection {
  subheading_en: string;
  subheading_ur: string;
  text_en: string;
  text_ur: string;
}

export interface GeminiTipsSection {
  heading_en: string;
  heading_ur: string;
  content_en: string;
  content_ur: string;
  priority: "high" | "medium" | "low";
  subsections?: GeminiTipsSubsection[];
}

export interface GeminiTipsAlert {
  type: "warning" | "caution" | "info";
  message_en: string;
  message_ur: string;
}

export interface GeminiTips {
  summary_en: string;
  summary_ur: string;
  sections: GeminiTipsSection[];
  alerts: GeminiTipsAlert[];
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  temperatureRange: TemperatureRange;
  tips: string;
  geminiTips?: GeminiTips;
  geminiTipsLoading?: boolean;
}
