import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";

export interface Crop {
  id: string;
  cropName: string;
  category: string;
  sowDate: string;
  condition: "excellent" | "good" | "fair" | "poor";
  farmerId: string; // To associate crops with specific farmers
  createdAt: string;
  updatedAt: string;
}

export interface CreateCropData {
  cropName: string;
  category: string;
  sowDate: string;
  condition: "excellent" | "good" | "fair" | "poor";
  farmerId: string;
}

export interface UpdateCropData {
  cropName?: string;
  category?: string;
  sowDate?: string;
  condition?: "excellent" | "good" | "fair" | "poor";
}

// Collection name
const CROPS_COLLECTION = "crop-persona";

/**
 * Create a new crop
 */
export const createCrop = async (cropData: CreateCropData): Promise<string> => {
  try {
    console.log("🌾 Creating new crop:", cropData);

    const now = new Date().toISOString();

    const cropDocument = {
      ...cropData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, CROPS_COLLECTION), cropDocument);

    console.log("✅ Crop created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating crop:", error);
    throw new Error("Failed to create crop");
  }
};

/**
 * Get all crops with optional filtering
 */
export const getAllCrops = async (options?: {
  farmerId?: string;
  category?: string;
  condition?: string;
  limitCount?: number;
}): Promise<Crop[]> => {
  try {
    console.log("📋 Fetching all crops with options:", options);

    let q = query(collection(db, CROPS_COLLECTION));
    // Add filters if provided
    if (options?.farmerId) {
      q = query(q, where("farmerId", "==", options.farmerId));
    }

    if (options?.category) {
      q = query(q, where("category", "==", options.category));
    }

    if (options?.condition) {
      q = query(q, where("condition", "==", options.condition));
    }

    // Order by creation date (newest first)
    // q = query(q, orderBy("createdAt", "desc"));
    // console.log((await getDocs(q)).docs[0].data());

    // Apply limit if provided
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const querySnapshot = await getDocs(q);
    const crops: Crop[] = [];
    console.log(querySnapshot.docs);
    querySnapshot.forEach((doc) => {
      console.log(doc);
      crops.push({
        id: doc.id,
        ...doc.data(),
      } as Crop);
    });

    console.log(`✅ Found ${crops.length} crops`);
    return crops;
  } catch (error) {
    console.error("❌ Error fetching crops:", error);
    throw new Error("Failed to fetch crops");
  }
};

/**
 * Get a single crop by ID
 */
export const getCropById = async (cropId: string): Promise<Crop | null> => {
  try {
    console.log("🔍 Fetching crop with ID:", cropId);

    const docRef = doc(db, CROPS_COLLECTION, cropId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const crop = {
        id: docSnap.id,
        ...docSnap.data(),
      } as Crop;

      console.log("✅ Crop found:", crop.cropName);
      return crop;
    } else {
      console.log("❌ No crop found with ID:", cropId);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching crop:", error);
    throw new Error("Failed to fetch crop");
  }
};

/**
 * Update a crop
 */
export const updateCrop = async (
  cropId: string,
  updates: UpdateCropData
): Promise<void> => {
  try {
    console.log("📝 Updating crop:", cropId, updates);

    const docRef = doc(db, CROPS_COLLECTION, cropId);

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updateData);

    console.log("✅ Crop updated successfully");
  } catch (error) {
    console.error("❌ Error updating crop:", error);
    throw new Error("Failed to update crop");
  }
};

/**
 * Delete a crop
 */
export const deleteCrop = async (cropId: string): Promise<void> => {
  try {
    console.log("🗑️ Deleting crop:", cropId);

    const docRef = doc(db, CROPS_COLLECTION, cropId);
    await deleteDoc(docRef);

    console.log("✅ Crop deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting crop:", error);
    throw new Error("Failed to delete crop");
  }
};

/**
 * Get crops by farmer ID
 */
export const getCropsByFarmer = async (farmerId: string): Promise<Crop[]> => {
  return getAllCrops({ farmerId });
};

/**
 * Get crops by category
 */
export const getCropsByCategory = async (category: string): Promise<Crop[]> => {
  return getAllCrops({ category });
};

/**
 * Get crops by condition
 */
export const getCropsByCondition = async (
  condition: string
): Promise<Crop[]> => {
  return getAllCrops({ condition });
};

/**
 * Get crop statistics
 */
export const getCropStatistics = async (): Promise<{
  totalCrops: number;
  cropsByCategory: Record<string, number>;
  cropsByCondition: Record<string, number>;
}> => {
  try {
    console.log("📊 Fetching crop statistics");

    const crops = await getAllCrops();

    const stats = {
      totalCrops: crops.length,
      cropsByCategory: {} as Record<string, number>,
      cropsByCondition: {} as Record<string, number>,
    };

    // Count by category
    crops.forEach((crop) => {
      stats.cropsByCategory[crop.category] =
        (stats.cropsByCategory[crop.category] || 0) + 1;

      stats.cropsByCondition[crop.condition] =
        (stats.cropsByCondition[crop.condition] || 0) + 1;
    });

    console.log("✅ Statistics calculated:", stats);
    return stats;
  } catch (error) {
    console.error("❌ Error calculating statistics:", error);
    throw new Error("Failed to calculate crop statistics");
  }
};

/**
 * Search crops by name
 */
export const searchCrops = async (searchTerm: string): Promise<Crop[]> => {
  try {
    console.log("🔍 Searching crops with term:", searchTerm);

    // Get all crops and filter client-side (Firestore doesn't support case-insensitive search)
    const allCrops = await getAllCrops();

    const filteredCrops = allCrops.filter(
      (crop) =>
        crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(`✅ Found ${filteredCrops.length} matching crops`);
    return filteredCrops;
  } catch (error) {
    console.error("❌ Error searching crops:", error);
    throw new Error("Failed to search crops");
  }
};
