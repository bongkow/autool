import React, { useState } from 'react';
type Position = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string,
  position?: Position; // Optional prop with default value 'top'
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className, position = 'top' }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Get the CSS classes for positioning the tooltip based on the 'position' prop
  const getPositionClasses = (position: Position) => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-1';
      case 'bottom':
        return 'top-full mt-1';
      case 'left':
        return 'right-full mr-1';
      case 'right':
        return 'left-full ml-1';
      default:
        return '';
    }
  };

  const positionClasses = getPositionClasses(position);

  return (
    <div className={`relative inline-block ${className||""}`}>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </div>
      {isHovering && (
        <div
          className={`absolute ${positionClasses} px-3 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-10`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;