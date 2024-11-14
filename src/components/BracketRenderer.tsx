import React from "react";
import TournamentBracket from "./TournamentBracket";

interface Round {
  round: number;
  matches: Match[];
}

interface Match {
  match: number;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

export interface Tournament {
  rounds: Round[];
  name?: string; // Add this line to include the tournament name
}

interface BracketRendererProps {
  tournament: Tournament;
  scale: number;
  blurAmount: string;
}

const BracketRenderer: React.FC<BracketRendererProps> = ({
  tournament,
  scale,
  blurAmount,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body { margin: 0; padding: 0; }
          .bracket-container {
            width: 1920px;
            height: 1080px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            filter: blur(${blurAmount});
            background-image: url('/bg-bracket.png');
            background-size: cover;
            background-position: center;
          }
          .bracket-content {
            transform: scale(${scale});
          }
          .tournament-name {
            position: absolute;
            bottom: 40px;
            right: 200px;
            color: black;
            font-size: 24px;
            font-weight: bold;
          }
        `}</style>
      </head>
      <body>
        <div className="bracket-container">
          <div className="bracket-content">
            <TournamentBracket tournament={tournament} />
          </div>
          <div className="tournament-name">
            {tournament.name || "NA - Tournament #1"}
          </div>
        </div>
      </body>
    </html>
  );
};

export default BracketRenderer;
