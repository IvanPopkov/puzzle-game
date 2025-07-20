import React, {useEffect, useRef} from "react";
import "./NumberWheel.css";

interface NumberWheelProps extends NumberWheelInputProps {
  onSelect: (num: number, index: number) => void;
  onClose: () => void;
}

export interface NumberWheelInputProps {
  n: number;
  x: number;
  y: number;
  index: number;
}

const NumberWheel: React.FC<NumberWheelProps> = ({ n, x, y, index, onSelect, onClose }) => {
  const radius = 50;
  const angleStep = (2 * Math.PI) / n;
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wheelRef.current && !wheelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={wheelRef}
      className="number-wheel"
      style={{
        top: y,
        left: x,
        width: radius * 4,
        height: radius * 4,
      }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const posX = radius * Math.cos(angle);
        const posY = radius * Math.sin(angle);

        const value = i + 1 < n ? i + 1 : 0;

        return (
          <button
            key={value}
            className="number"
            style={{
              top: `calc(50% + ${posY}px)`,
              left: `calc(50% + ${posX}px)`,
            }}
            onClick={() => onSelect(value, index)}
          >
            { value === 0 ? '' : value }
          </button>
        );
      })}
    </div>
  );
};

export default NumberWheel;