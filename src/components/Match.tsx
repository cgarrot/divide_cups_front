import React from "react";
import Label from "./Label";

interface MatchProps {
  matchName: string;
  team1: string;
  scoreTeam1: number;
  team2: string;
  scoreTeam2: number;
  isReversed?: boolean;
}

const Match: React.FC<MatchProps> = ({
  matchName,
  team1,
  scoreTeam1,
  team2,
  scoreTeam2,
  isReversed = false,
}) => {
  return (
    <div className="flex flex-col items-start">
      <div className="mb-2 flex items-center">
        <span className="text-black font-semibold text-xs mr-2">
          {isReversed ? "" : "//"}
        </span>
        <span className="text-black font-semibold text-xs">
          {matchName.toUpperCase()}
        </span>
        <span className="text-black font-semibold text-xs ml-2">
          {isReversed ? "//" : ""}
        </span>
      </div>
      <div className="flex flex-col gap-y-4">
        <Label score={scoreTeam1} teamName={team1} reverse={isReversed} />
        <Label score={scoreTeam2} teamName={team2} reverse={isReversed} />
      </div>
    </div>
  );
};

export default Match;
