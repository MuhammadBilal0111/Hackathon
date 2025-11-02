"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  Share2,
  User,
  Loader2,
  Pencil,
  Trash,
} from "lucide-react";
import {
  getProductBySlug,
  getAllProducts,
  type Product,
} from "@/lib/firebase-products";
import { UpdateProductForm } from "@/components/forms/update-product-form";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { slug } = use(params);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await getProductBySlug(slug);

        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setQuantity(1);

          // Fetch related products from same category
          const allProducts = await getAllProducts();
          const related = allProducts
            .filter(
              (p) =>
                p.category === fetchedProduct.category &&
                p.id !== fetchedProduct.id
            )
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} items to cart`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div>
            <div className="bg-muted rounded-lg overflow-hidden mb-4 sticky top-24">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-full flex justify-between">
                  <div className="flex gap-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div
                  className="p-2 border border-gray-300 bg-white shadow-lg z-10 top-[-15] right-[-15] rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  <Pencil className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <User className="w-4 h-4" />
                <span className="text-sm">by {product.vendor}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">
                  Rs {product.price}
                </span>
                {product.tag && (
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {product.tag}
                  </span>
                )}
              </div>
              {product.stock > 0 ? (
                <p className="text-green-600 font-semibold">
                  ✓ In Stock ({product.stock} units available)
                </p>
              ) : (
                <p className="text-destructive font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground mb-6">{product.description}</p>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold capitalize">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-semibold flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {product.vendor}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                    disabled={product.stock === 0}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-center min-w-16">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-2 hover:bg-muted transition-colors"
                    disabled={product.stock === 0}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Max: {product.stock} units
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 bg-transparent"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-current text-destructive" : ""
                  }`}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 bg-transparent"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Delivery Info */}
            <Card className="bg-secondary p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-muted-foreground">
                      Orders above Rs 2000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Quality Guarantee</p>
                    <p className="text-muted-foreground">
                      Authentic products or refund
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12 py-8 border-t border-b border-border">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {product.reviews > 0 ? (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                No reviews yet. Be the first to review this product!
              </p>
            </Card>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/products/${relProduct.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-muted overflow-hidden h-48">
                      <img
                        src={relProduct.image || "/placeholder.svg"}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {relProduct.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {relProduct.vendor}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                          Rs {relProduct.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm text-muted-foreground">
                            {relProduct.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Update Product Modal */}
      {product && (
        <UpdateProductForm
          product={product}
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </main>
  );
}
