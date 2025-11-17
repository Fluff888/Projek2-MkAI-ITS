import React from 'react';
import type { ElementData } from '../types';
import { PERIODIC_TABLE_ELEMENTS, CATEGORY_COLORS } from '../constants';

interface PeriodicTableProps {
  onElementClick: (element: ElementData) => void;
  selectedElement: ElementData | null;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementClick, selectedElement }) => {
  return (
    <div className="p-2 md:p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="grid grid-cols-18 gap-1">
        {PERIODIC_TABLE_ELEMENTS.map((element) => {
          const colorClass = CATEGORY_COLORS[element.category] || "bg-gray-700 hover:bg-gray-600";
          const isSelected = selectedElement?.number === element.number;
          return (
            <div
              key={element.number}
              onClick={() => onElementClick(element)}
              className={`
                ${colorClass}
                p-1 md:p-1.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out
                flex flex-col items-center justify-center aspect-square
                text-white transform hover:scale-110 hover:z-10 shadow-md hover:shadow-xl
                border-2 ${isSelected ? 'border-cyan-400 scale-110' : 'border-transparent'}
              `}
              style={{ gridColumn: element.xpos, gridRow: element.ypos }}
            >
              <div className="text-xs font-light text-gray-200">{element.number}</div>
              <div className="text-sm md:text-lg font-bold">{element.symbol}</div>
              <div className="hidden sm:block text-[8px] md:text-[10px] text-center leading-tight">{element.name}</div>
            </div>
          );
        })}
      </div>
       <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(CATEGORY_COLORS).map(([category, colorClass]) => (
          <div key={category} className="flex items-center space-x-2 text-xs">
            <div className={`w-3 h-3 rounded-sm ${colorClass.split(' ')[0]}`}></div>
            <span className="capitalize text-gray-300">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeriodicTable;