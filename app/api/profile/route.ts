// app/api/profile/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    name: "USman Khan",
    role: "Farmer",
    location: "Sindh, Pakistan",
    registeredAt: "2025-10-01",
    email: "bilal.ahmed@example.com",
    phone: "+92 300 1234567",
    farmSize: "50 acres",
    crops: ["Wheat", "Cotton", "Corn"],
    avatar: "/images/avatar.png",
  };

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    // Mock response - in production, this would update the database
    const updatedProfile = {
      ...body,
      updatedAt: new Date().toISOString(),
      message: "Profile updated successfully",
    };

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
