# API Documentation

Complete API structure for Crop Analysis and Profile Management using Axios and Next.js App Router.

## 📁 Folder Structure

```
src/
├── services/
│   ├── apiClient.ts        # Reusable Axios instance
│   ├── cropService.ts      # Crop analysis API functions
│   ├── profileService.ts   # Profile API functions
│   └── index.ts            # Barrel exports

app/
├── api/
│   ├── crop-analysis/
│   │   └── route.ts        # Crop analysis endpoint
│   └── profile/
│       └── route.ts        # Profile endpoint
├── analysis/
│   └── page.tsx            # Crop analysis UI (integrated with API)
└── dashboard/
    └── page.tsx            # Example dashboard showing both APIs
```

## ⚙️ Setup

### 1. Axios Configuration

**File:** `src/services/apiClient.ts`

Reusable Axios instance with base configuration:

```typescript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 2. Service Layer

#### Crop Service

**File:** `src/services/cropService.ts`

```typescript
export const getCropAnalysis = async () => {
  const response = await apiClient.get("/crop-analysis");
  return response.data;
};

export const analyzeCrop = async (formData: FormData) => {
  const response = await apiClient.post("/crop-analysis", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
```

#### Profile Service

**File:** `src/services/profileService.ts`

```typescript
export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await apiClient.put("/profile", profileData);
  return response.data;
};
```

## 🛣️ API Routes

### 1. Crop Analysis API

**Endpoint:** `/api/crop-analysis`

#### GET Request

Returns mock crop analysis data.

**Response:**
```json
{
  "crop": "Wheat",
  "healthStatus": "Good",
  "pestDetected": false,
  "recommendation": "Continue regular irrigation schedule."
}
```

#### POST Request

Accepts form data with crop image and returns analysis.

**Request Body (FormData):**
- `photo` - Image file
- `cropType` - String
- `notes` - String (optional)

**Response:**
```json
{
  "detectedCrop": "Corn",
  "healthStatus": "Healthy",
  "pestDisease": "None",
  "treatmentPlan": "No treatment required. Continue with regular monitoring.",
  "analysis": {
    "confidence": 95,
    "uploadedAt": "2025-11-01T10:30:00.000Z",
    "notes": ""
  }
}
```

### 2. Profile API

**Endpoint:** `/api/profile`

#### GET Request

Returns user profile data.

**Response:**
```json
{
  "name": "Bilal Ahmed",
  "role": "Farmer",
  "location": "Sindh, Pakistan",
  "registeredAt": "2025-10-01",
  "email": "bilal.ahmed@example.com",
  "phone": "+92 300 1234567",
  "farmSize": "50 acres",
  "crops": ["Wheat", "Cotton", "Corn"],
  "avatar": "/images/avatar.png"
}
```

#### PUT Request

Updates user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "location": "New Location",
  ...
}
```

**Response:**
```json
{
  "name": "Updated Name",
  "location": "New Location",
  "updatedAt": "2025-11-01T10:30:00.000Z",
  "message": "Profile updated successfully"
}
```

## 💻 Usage Examples

### In Components

```typescript
import { getProfile } from "@/src/services/profileService";
import { getCropAnalysis, analyzeCrop } from "@/src/services/cropService";

// Fetch profile data
const profile = await getProfile();

// Get crop analysis
const analysis = await getCropAnalysis();

// Analyze crop with form data
const formData = new FormData();
formData.append("photo", file);
formData.append("cropType", "Corn");
const result = await analyzeCrop(formData);
```

### Example Dashboard

Visit `/dashboard` to see both APIs in action with:
- ✅ Real-time data fetching
- ✅ Loading states
- ✅ JSON response display
- ✅ Console logging

### Integrated Crop Analysis Page

Visit `/analysis` to see the full crop analysis workflow:
- ✅ Form with image upload
- ✅ Validation with Zod
- ✅ React Hook Form integration
- ✅ Real API calls using Axios
- ✅ Results display

## 🧪 Testing the APIs

### 1. Test Dashboard (Both APIs)

```bash
npm run dev
```

Navigate to: `http://localhost:3000/dashboard`

You'll see:
- Profile data loaded from API
- Crop analysis data loaded from API
- Raw JSON in console
- Visual display of both datasets

### 2. Test Crop Analysis (Form Submission)

Navigate to: `http://localhost:3000/analysis`

1. Enter crop type
2. Upload an image
3. Submit form
4. See results from API

### 3. Test via Console

Open browser console and run:

```javascript
// Test profile API
fetch('/api/profile')
  .then(r => r.json())
  .then(console.log);

// Test crop analysis API
fetch('/api/crop-analysis')
  .then(r => r.json())
  .then(console.log);
```

## 🔧 Customization

### Add Authentication

Update `apiClient.ts`:

```typescript
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});
```

### Add Interceptors

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);
```

### Connect to Real Backend

Update `baseURL` in `apiClient.ts`:

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  // ...
});
```

## 📋 Features

✅ Modular service architecture  
✅ Reusable Axios instance  
✅ TypeScript support  
✅ Error handling  
✅ Mock JSON responses  
✅ GET and POST endpoints  
✅ FormData support for file uploads  
✅ Clean separation of concerns  
✅ Ready for frontend integration  
✅ Working example pages  

## 🚀 Next Steps

1. **Deploy APIs** - The routes are production-ready
2. **Add Database** - Replace mock data with real database calls
3. **Add Authentication** - Implement JWT or session-based auth
4. **Add Validation** - Use Zod for request validation
5. **Add Rate Limiting** - Protect your APIs
6. **Add Logging** - Monitor API usage
7. **Connect ML Model** - Replace mock crop analysis with real AI

## 📝 Notes

- All API responses are currently **mock data**
- Perfect for **frontend development** and testing
- Easy to replace with **real backend** logic
- **Type-safe** with TypeScript
- **Error handling** included in all services
