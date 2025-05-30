import React from 'react';
import { useRouter } from 'next/navigation';

interface RoleSelectionProps {
  onSelect: (role: 'supplier' | 'buyer') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white">Choose Your Role</h3>
        <p className="text-sm text-gray-400 mt-2">Select how you'll use Tracui</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onSelect('supplier')}
          className="p-6 border border-[#00FFD1] rounded-xl bg-black/50 hover:bg-[#00FFD1]/10 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#00FFD1]/10 flex items-center justify-center group-hover:bg-[#00FFD1]/20 transition-all">
              <svg className="w-6 h-6 text-[#00FFD1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-white">Supplier</h4>
              <p className="text-sm text-gray-400 mt-1">Register and track products</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect('buyer')}
          className="p-6 border border-[#00FFD1] rounded-xl bg-black/50 hover:bg-[#00FFD1]/10 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#00FFD1]/10 flex items-center justify-center group-hover:bg-[#00FFD1]/20 transition-all">
              <svg className="w-6 h-6 text-[#00FFD1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-white">Buyer</h4>
              <p className="text-sm text-gray-400 mt-1">Verify and purchase products</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection; 