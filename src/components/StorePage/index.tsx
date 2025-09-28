'use client';

import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { getProductsForCountry } from '../../lib/country-utils';

interface StorePageProps {
  storeName: string;
  storeId: string;
  country: string;
  onBack: () => void;
}

export default function StorePage({ storeName, storeId, country, onBack }: StorePageProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const availableProducts = getProductsForCountry(country);

  return (
    <div className="min-h-screen bg-[#F4F4F8] font-inter flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <div
            className="w-11 h-11 flex items-center justify-center cursor-pointer bg-[#E9E9EB] rounded-full"
            onClick={onBack}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1C1C1E]">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Store Name */}
          <h1 className="text-lg font-semibold text-[#1C1C1E] font-inter text-center flex-1">
            {storeName}
          </h1>

          {/* Empty space for balance */}
          <div className="w-11 h-11"></div>
        </div>
      </div>

      {/* Country Info */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm text-gray-600 font-inter">
            <span className="font-medium">Country:</span> {country}
          </p>
        </div>
      </div>

      {/* Product Selection */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold text-[#1C1C1E] mb-4 font-inter">Select Product</h2>
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {availableProducts.map((product, index) => (
            <div
              key={product}
              className={`px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 cursor-pointer font-inter flex items-center gap-2 flex-shrink-0 ${
                selectedProduct === product
                  ? 'bg-[#1C1C1E] text-white'
                  : 'bg-[#E0E0E0] text-[#1C1C1E]'
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <span className="text-base">
                {product === 'bananas' ? '🍌' : 
                 product === 'beef' ? '🥩' : 
                 product === 'pork' ? '🥓' : 
                 product === 'apples' ? '🍎' : 
                 product === 'pears' ? '🍐' : '📦'}
              </span>
              {product.charAt(0).toUpperCase() + product.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {/* Product Selection Complete */}
      {selectedProduct && (
        <div className="px-6 pb-6 flex-1">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-32 h-32 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-green-600">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1C1C1E] mb-2 font-inter">Product Selected</h3>
            <p className="text-gray-600 font-inter mb-4">
              You have selected: <span className="font-semibold text-[#1C1C1E]">{selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)}</span>
            </p>
            <Button
              onClick={() => setSelectedProduct(null)}
              variant="secondary"
              className="w-full"
            >
              Change Product
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
