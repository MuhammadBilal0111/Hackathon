# Gemini Weather Tips - Structured Schema

## Overview

The Gemini API now returns structured, organized farming recommendations instead of plain text, making it easier to display with proper formatting, priority indicators, and nested information.

## Response Schema

```typescript
{
  summary: string,              // Brief 2-3 sentence overview
  sections: Section[],          // Array of recommendation sections
  alerts: Alert[]               // Critical warnings/notices
}
```

### Section Object

```typescript
{
  heading: string,              // Section title (e.g., "Immediate Actions")
  content: string,              // Main content (3-5 sentences)
  priority: "high" | "medium" | "low",  // Priority level
  subsections?: Subsection[]    // Optional nested details
}
```

### Subsection Object

```typescript
{
  subheading: string,           // Subsection title
  text: string                  // Subsection content
}
```

### Alert Object

```typescript
{
  type: "warning" | "caution" | "info",  // Severity level
  message: string               // Alert message
}
```

## Example Response

```json
{
  "summary": "Current weather conditions are favorable for most crops with moderate temperatures and adequate humidity. However, rising temperatures over the next 3 days require proactive irrigation management.",

  "sections": [
    {
      "heading": "Immediate Actions (Next 24-48 Hours)",
      "content": "Prioritize morning irrigation between 6-8 AM to minimize water loss. Check soil moisture levels in all fields and adjust irrigation schedules. Ensure drainage systems are clear for the upcoming week.",
      "priority": "high",
      "subsections": [
        {
          "subheading": "Morning Tasks",
          "text": "Complete irrigation before 8 AM. Check drip systems for blockages."
        },
        {
          "subheading": "Afternoon Tasks",
          "text": "Inspect crop health and monitor for pest activity in warmer conditions."
        }
      ]
    },
    {
      "heading": "Irrigation & Water Management",
      "content": "With increasing temperatures, crops will require 20-30% more water. Implement early morning watering schedules. Consider mulching to reduce evaporation. Monitor soil moisture daily, especially for shallow-rooted vegetables.",
      "priority": "high"
    },
    {
      "heading": "Pest & Disease Prevention",
      "content": "Warm, humid conditions favor fungal growth and pest activity. Apply neem-based organic pesticides in the evening. Monitor for aphids, whiteflies, and signs of powdery mildew. Ensure good air circulation between plants.",
      "priority": "medium",
      "subsections": [
        {
          "subheading": "Preventive Measures",
          "text": "Spray neem oil solution (5ml per liter) in the evening every 3-4 days."
        },
        {
          "subheading": "Monitoring",
          "text": "Check undersides of leaves daily for pest eggs and early infestations."
        }
      ]
    },
    {
      "heading": "Crop-Specific Advice",
      "content": "Wheat: Maintain moisture during grain filling stage. Rice: Prepare nursery beds with adequate drainage. Cotton: Monitor for bollworm activity. Vegetables: Provide shade during peak sun hours (12-3 PM).",
      "priority": "medium"
    },
    {
      "heading": "Soil Management",
      "content": "Current temperature and moisture levels are ideal for soil amendment. Apply organic compost to improve water retention. Consider adding mulch layers (2-3 inches) around plants to conserve moisture and regulate soil temperature.",
      "priority": "low"
    }
  ],

  "alerts": [
    {
      "type": "warning",
      "message": "High UV index expected (8+) - protect young seedlings with shade cloth during 11 AM to 3 PM."
    },
    {
      "type": "caution",
      "message": "Temperature rising to 32°C by Day 3 - increase irrigation frequency to prevent heat stress."
    },
    {
      "type": "info",
      "message": "Favorable conditions for fertilizer application in the next 24 hours before temperature rises."
    }
  ]
}
```

## UI Rendering

### Summary

- Displayed at the top with an icon
- Provides quick weather overview

### Alerts

- Color-coded by severity:
  - **Warning** (red): Critical issues requiring immediate attention
  - **Caution** (orange): Important considerations
  - **Info** (blue): Helpful tips and opportunities
- Displayed prominently with icons

### Sections

- Rendered as cards with:
  - **Heading**: Section title
  - **Priority badge**: Color-coded (High=red, Medium=orange, Low=blue)
  - **Content**: Main recommendation text
  - **Subsections**: Nested details with subheadings (if present)

### Priority Colors

- **High**: Red background, red text, red border
- **Medium**: Orange background, orange text, orange border
- **Low**: Blue background, blue text, blue border

## Benefits

1. **Structured Organization**: Clear sections instead of wall of text
2. **Priority Indication**: Visual cues for urgent vs. optional actions
3. **Nested Information**: Complex topics broken into digestible parts
4. **Alert System**: Critical warnings stand out visually
5. **Better UX**: Scannable, organized, professional appearance
6. **Actionable**: Each section provides specific, implementable advice

## Files Modified

- `app/api/weather/gemini-tips/route.ts` - Added structured schema with SchemaType
- `app/(dashboard)/weather/types.ts` - Added TypeScript interfaces for structured response
- `app/(dashboard)/weather/weather-display.tsx` - Updated UI to render structured data with priority badges, alerts, and subsections
