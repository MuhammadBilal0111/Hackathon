"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">About SmartKissan</h3>
            <p className="text-sm opacity-90">
              Connecting farmers directly with customers for fresh, quality
              produce.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <Link href="#" className="hover:opacity-100">
                  Browse Products
                </Link>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Become a Vendor
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Track Order
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <a href="#" className="hover:opacity-100">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>
                <a href="#" className="hover:opacity-100">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground border-opacity-20 pt-8 text-center text-sm">
          <p className="opacity-90">
            &copy; 2025 SmartKissan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
