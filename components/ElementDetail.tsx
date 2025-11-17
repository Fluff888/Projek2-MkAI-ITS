import React from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ElementDetailProps {
  element: ElementData | null;
}

const ElementDetail: React.FC<ElementDetailProps> = ({ element }) => {
  if (!element) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg h-full flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Pilih elemen dari tabel untuk melihat detailnya dan memulai pelajaran!
        </p>
      </div>
    );
  }

  const colorClass = CATEGORY_COLORS[element.category]?.split(' ')[0] || "bg-gray-700";

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <div className={`${colorClass} w-20 h-20 rounded-lg flex flex-col items-center justify-center shadow-md`}>
          <span className="text-2xl font-bold">{element.symbol}</span>
          <span className="text-sm">{element.number}</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{element.name}</h2>
          <p className="text-gray-400 capitalize">{element.category}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-300">
          <span className="font-semibold">Massa Atom:</span> {element.atomic_mass.toFixed(3)}
        </div>
        <div className="text-gray-300">
          <span className="font-semibold">Fase:</span> {element.phase}
        </div>
      </div>
      <p className="mt-4 text-gray-400 text-sm">{element.summary}</p>
    </div>
  );
};

export default ElementDetail;