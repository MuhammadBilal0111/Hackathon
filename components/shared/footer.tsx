"use client";

import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-lime-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AgriSmart</span>
            </div>
            <p className="text-gray-600">
              Empowering Pakistani farmers with smart agricultural technology
              and data-driven insights.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Crop Analysis
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Weather Insights
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Annual Planning
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Pest Control
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Documentation
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Community
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                About Us
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Careers
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-green-600 transition-colors cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-600">
          <p>
            &copy; 2025 AgriSmart. All rights reserved. Made for Pakistani
            farmers with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
