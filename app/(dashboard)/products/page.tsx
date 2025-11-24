"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/cards/products-card";
import { Filter, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllProducts, type Product } from "@/lib/firebase-products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-low");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from Firebase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);

        // Calculate max price for slider
        if (fetchedProducts.length > 0) {
          const maxPrice = Math.max(...fetchedProducts.map((p) => p.price));
          setPriceRange([0, Math.ceil(maxPrice / 100) * 100]); // Round up to nearest 100
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchPrice && matchSearch;
    });
  }, [products, priceRange, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [filteredProducts, sortBy]);

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Farming Inputs Marketplace
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search fertilizers, pesticides, equipment..."
              className="pl-10 pr-4 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="flex items-center gap-2 font-bold mb-6 text-lg">
                <Filter className="w-5 h-5" />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const count =
                      cat === "all"
                        ? products.length
                        : products.filter((p) => p.category === cat).length;

                    return (
                      <label
                        key={cat}
                        className="flex items-center justify-between gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">
                            {cat === "all" ? "All Products" : cat}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={5000}
                  step={100}
                  className="mb-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rs {priceRange[0]}</span>
                  <span>Rs {priceRange[1]}</span>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-3 text-sm">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {(selectedCategory !== "all" ||
                priceRange[0] !== 0 ||
                priceRange[1] !== 5000 ||
                searchQuery) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 5000]);
                    setSearchQuery("");
                    setSortBy("price-low");
                  }}
                  className="w-full mt-6"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {sortedProducts.length} of {products.length}{" "}
                    products
                  </div>
                  {products.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        (window.location.href = "/vendors/dashboard")
                      }
                    >
                      Add Products
                    </Button>
                  )}
                </div>

                {products.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Search className="w-16 h-16 text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          No Products Available
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          There are no products in the marketplace yet.
                        </p>
                        <Button
                          onClick={() =>
                            (window.location.href = "/vendors/dashboard")
                          }
                        >
                          Go to Vendor Dashboard
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          id: parseInt(product.id || "0"),
                          slug: product.slug,
                          name: product.name,
                          vendor: product.vendor,
                          price: product.price,
                          reviews: product.reviews,
                          rating: product.rating,
                          image: product.image || "/placeholder.svg",
                          tag: product.tag,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Products Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No products match your current filters.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceRange([
                          0,
                          Math.max(...products.map((p) => p.price)),
                        ]);
                        setSearchQuery("");
                        setSortBy("featured");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
