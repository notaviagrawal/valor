'use client';

import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { getProductsForCountry } from '../../lib/country-utils';

interface StorePageProps {
  storeName: string;
  storeId: string;
  country: string;
  storeType?: 'grocery' | 'gas';
  onBack: () => void;
}

export default function StorePage({ storeName, storeId, country, storeType = 'grocery', onBack }: StorePageProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(storeType === 'gas' ? 'regular' : null);
  const [price, setPrice] = useState<string>('');

  const availableProducts = storeType === 'gas' 
    ? ['regular', 'premium', 'diesel']
    : getProductsForCountry(country);

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
        <h2 className="text-xl font-bold text-[#1C1C1E] mb-4 font-inter">
          {storeType === 'gas' ? 'Select Gas Type' : 'Select Product'}
        </h2>
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
                {storeType === 'gas' ? (
                  product === 'regular' ? '⛽' :
                  product === 'premium' ? '⛽' :
                  product === 'diesel' ? '⛽' : '⛽'
                ) : (
                  product === 'bananas' ? '🍌' : 
                  product === 'beef' ? '🥩' : 
                  product === 'pork' ? '🥓' : 
                  product === 'apples' ? '🍎' : 
                  product === 'pears' ? '🍐' : '📦'
                )}
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
              <span className="text-6xl">
                {storeType === 'gas' ? '⛽' : (
                  selectedProduct === 'bananas' ? '🍌' :
                  selectedProduct === 'beef' ? '🥩' :
                  selectedProduct === 'pork' ? '🥓' :
                  selectedProduct === 'apples' ? '🍎' :
                  selectedProduct === 'pears' ? '🍐' : '📦'
                )}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#1C1C1E] mb-2 font-inter">
              {storeType === 'gas' ? 'Gas type selected, enter price' : 'Product selected, enter price'}
            </h3>
            <p className="text-gray-600 font-inter mb-4">
              You selected <span className="font-semibold text-[#1C1C1E]">{selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)}</span>
            </p>

            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">Price</label>
              <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-[#1C1C1E] focus-within:border-transparent">
                <span className="pl-4 text-gray-500">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 h-11 px-3 border-0 bg-transparent focus:outline-none text-[#1C1C1E] font-inter"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {}}
                variant="primary"
                className="w-full"
              >
                Send
              </Button>
              <Button
                onClick={() => setSelectedProduct(null)}
                variant="secondary"
                className="w-full"
              >
                {storeType === 'gas' ? 'Change Gas Type' : 'Change Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
