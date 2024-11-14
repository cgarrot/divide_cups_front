import React from "react";
import Label from "./Label";

interface FinalMatchProps {
  matchName: string;
  team1: string;
  scoreTeam1: number;
  team2: string;
  scoreTeam2: number;
}

const FinalMatch: React.FC<FinalMatchProps> = ({
  matchName,
  team1,
  scoreTeam1,
  team2,
  scoreTeam2,
}) => {
  return (
    <div className="flex flex-col items-center scale-125">
      <div className="mb-4 flex items-center">
        <span className="text-black font-semibold text-lg">
          {matchName.toUpperCase()}
        </span>
      </div>
      <div className="flex justify-between w-full">
        <Label score={scoreTeam1} teamName={team1} />
        <div className="mx-4 flex items-center">
          <span className="text-3xl font-bold">VS</span>
        </div>
        <Label score={scoreTeam2} teamName={team2} reverse={true} />
      </div>
    </div>
  );
};

export default FinalMatch;
