"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface Product {
  id: number;
  slug: string;
  name: string;
  vendor: string;
  price: number;
  reviews: number;
  rating: number;
  image: string;
  tag?: string;
  description?: string;
  category?: string;
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative">
      <Card className="overflow-hidden relative hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <Link
          href={`/products/${product.slug}`}
          className="relative overflow-hidden group"
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={192}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.tag && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
              {product.tag}
            </div>
          )}
        </Link>

        <div className="p-4 flex-1 flex flex-col">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-foreground line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2">{product.vendor}</p>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
            <span className="font-bold text-lg text-primary">
              Rs {product.price}
            </span>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
