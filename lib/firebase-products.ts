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
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

export interface Product {
  id?: string;
  name: string;
  vendor: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  tag?: string;
  image: string;
  slug: string;
  reviews: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  vendor: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  tag?: string;
  image: string;
}

// Generate slug from product name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Create a new product
export const createProduct = async (
  productData: CreateProductData
): Promise<string> => {
  try {
    const slug = generateSlug(productData.name);
    const now = new Date().toISOString();

    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      slug,
      reviews: 0,
      rating: 0,
      createdAt: now,
      updatedAt: now,
    });

    console.log("Product created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    throw new Error("Failed to fetch products");
  }
};

// Get products by vendor
export const getProductsByVendor = async (
  vendorName: string
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("vendor", "==", vendorName),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting vendor products:", error);
    throw new Error("Failed to fetch vendor products");
  }
};

// Get product by ID
export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw new Error("Failed to fetch product");
  }
};

// Get product by slug
export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  try {
    const q = query(
      collection(db, "products"),
      where("slug", "==", slug),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product by slug:", error);
    throw new Error("Failed to fetch product");
  }
};

// Update a product
export const updateProduct = async (
  productId: string,
  updates: Partial<CreateProductData>
): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);
    const now = new Date().toISOString();

    const updateData: any = {
      ...updates,
      updatedAt: now,
    };

    // Update slug if name changed
    if (updates.name) {
      updateData.slug = generateSlug(updates.name);
    }

    await updateDoc(productRef, updateData);
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
};

// Get out of stock products
export const getOutOfStockProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("stock", "==", 0),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting out of stock products:", error);
    throw new Error("Failed to fetch out of stock products");
  }
};

// Get low stock products (stock < threshold)
export const getLowStockProducts = async (
  threshold: number = 10
): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter(
      (product) => product.stock > 0 && product.stock < threshold
    );
  } catch (error) {
    console.error("Error getting low stock products:", error);
    throw new Error("Failed to fetch low stock products");
  }
};

// Update product stock
export const updateProductStock = async (
  productId: string,
  newStock: number
): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      stock: newStock,
      updatedAt: new Date().toISOString(),
    });
    console.log("Product stock updated successfully");
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw new Error("Failed to update product stock");
  }
};

// Get featured products (with tag)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter((product) => product.tag);
  } catch (error) {
    console.error("Error getting featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
};

// Search products by name
export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        product.description.toLowerCase().includes(lowerSearchTerm) ||
        product.vendor.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
};

// Get product statistics for vendor
export const getVendorStatistics = async (vendorName: string) => {
  try {
    const products = await getProductsByVendor(vendorName);

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.stock > 0).length;
    const outOfStockProducts = products.filter((p) => p.stock === 0).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const averagePrice =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
        : 0;
    const averageRating =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + p.rating, 0) / totalProducts
        : 0;

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalStock,
      averagePrice,
      averageRating: averageRating.toFixed(1),
    };
  } catch (error) {
    console.error("Error getting vendor statistics:", error);
    throw new Error("Failed to fetch vendor statistics");
  }
};
