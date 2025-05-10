"use client";

import { ShoppingBag, ArrowRight, ListIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EnvironmentPage() {
  const router = useRouter();
  
  const handleNavigation = () => {
    router.push("/session");
  };

  return (
  <div className="flex items-center justify-center min-h-[calc(100vh-7rem)] pt">
      <div className="w-full max-w-md shadow-xl bg-white dark:bg-black rounded-xl overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Buy or no buy?</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Our simulation will help you make the right decision for your purchase.
          </p>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            <p className="text-gray-700">Do you wish to run the simulation to buy the product?</p>
            <button 
              onClick={handleNavigation}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full"
            >
              <span>Run Simulation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => router.push("/session")}
              className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full"
            >
              <span>View All Sessions</span>
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}