import React from "react";

interface BracketConnectorProps {
  reverse?: boolean;
  height: number;
}

const BracketConnector: React.FC<BracketConnectorProps> = ({
  reverse = false,
  height,
}) => {
  const width = 15;
  const smallLineWidth = 15;

  return (
    <svg width={width + smallLineWidth} height={height} className="my-0">
      <g
        transform={
          reverse
            ? `scale(-1, 1) translate(-${width + smallLineWidth}, 0)`
            : undefined
        }
      >
        <path
          d={`M0,0 H${width} V${height} H0 V${height} H${width} V0 H0 Z`}
          fill="none"
          stroke="#e43c60"
          strokeWidth="3"
        />
        <line
          x1={width}
          y1={height / 2}
          x2={width + smallLineWidth}
          y2={height / 2}
          stroke="#e43c60"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};

export default BracketConnector;
