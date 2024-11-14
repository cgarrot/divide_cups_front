import React from "react";

interface LabelProps {
  score: number;
  teamName: string;
  reverse?: boolean;
}

const Label: React.FC<LabelProps> = ({ score, teamName, reverse = false }) => {
  const numberSvg = (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <path d="M0 0 L56 0 L56 56 L0 56 Z" fill="#eb3d7c" />
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="24"
        fill="black"
        className="text-black font-normal text-3xl"
      >
        {score}
      </text>
    </svg>
  );

  const nameSvg = (
    <svg width="240" height="56" viewBox="0 0 240 56">
      <path
        d={
          reverse
            ? "M240 0 L16 0 L0 16 L0 56 L240 56 Z"
            : "M0 0 L224 0 L240 16 L240 56 L0 56 Z"
        }
        fill="black"
      />
      <text
        x="120"
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="20"
        fill="white"
        className="text-white font-normal text-2xl"
      >
        {teamName ? teamName.toUpperCase() : "TBD"}
      </text>
    </svg>
  );

  return (
    <div className="flex items-center">
      {reverse ? (
        <>
          {nameSvg}
          {numberSvg}
        </>
      ) : (
        <>
          {numberSvg}
          {nameSvg}
        </>
      )}
    </div>
  );
};

export default Label;
