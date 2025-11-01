# API Integration Guide

## Crop Analysis API

The AI Crop Analysis page is configured to make API requests using axios when the form is submitted with react-hook-form and zod validation.

### Current Configuration

**Endpoint**: `https://api.example.com/analyze-crop` (configurable via environment variable)  
**Method**: POST  
**Content-Type**: multipart/form-data

### Technologies Used

- ✅ **axios** - For HTTP requests
- ✅ **react-hook-form** - For form state management
- ✅ **zod** - For form validation
- ✅ **@hookform/resolvers** - For zod integration with react-hook-form

### Request Format

The form sends the following data:

```typescript
const formData = new FormData();
formData.append("photo", file); // File object from the input (max 5MB)
formData.append("cropType", string); // User-entered crop type
formData.append("notes", string); // Optional notes
```

### File Validation Rules

- **Size**: Maximum 5MB
- **Formats**: JPEG, PNG, WebP only
- **Required**: Yes

### Expected Response Format

```json
{
  "detectedCrop": "string",
  "healthStatus": "Healthy" | "At Risk" | "Critical",
  "pestDisease": "string",
  "treatmentPlan": "string"
}
```

### How to Configure the API Endpoint

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-actual-api.com
```

3. The application will automatically use this URL for API requests.

### Code Implementation

The form submission is handled in `app/crop-analysis/page.tsx`:

```typescript
const handleFormSubmit = async (formData: any) => {
  const uploadData = new FormData();
  uploadData.append("photo", formData.photo);
  uploadData.append("cropType", formData.cropType);
  if (formData.notes) {
    uploadData.append("notes", formData.notes);
  }

  const axios = (await import("axios")).default;
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/analyze-crop",
    uploadData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  // Handle response...
};
```

### Form Validation Schema

Located in `components/forms/crop-photo-form.tsx`:

```typescript
const cropPhotoFormSchema = z.object({
  cropType: z.string().min(1, "Please select or enter crop type"),
  photo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are supported"
    ),
  notes: z.string().optional(),
});
```

### Adding Authentication

If your API requires authentication, modify the axios request:

```typescript
const response = await axios.post(
  process.env.NEXT_PUBLIC_API_URL,
  uploadData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  }
);
```

### Error Handling

The application includes:
- Form validation errors (displayed inline)
- API request errors (with fallback to demo data)
- Loading states during submission
- Success/error notifications

### Demo Mode

Currently, if the API call fails, the app displays demo data based on the user's input. To disable this in production, uncomment the `throw error;` line in the catch block.

## Components Structure

```
app/crop-analysis/page.tsx          # Main page with API integration
components/forms/crop-photo-form.tsx # Form with react-hook-form & zod
components/analysis-result.tsx       # Results display component
```

## Testing

To test the form:
1. Start the dev server: `npm run dev`
2. Navigate to `/crop-analysis`
3. Fill in the crop type
4. Upload an image (JPEG, PNG, or WebP under 5MB)
5. Click "Analyze Crop"
6. The form will attempt to call your API, or show demo data if it fails
