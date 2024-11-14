import React from "react";
import Match from "./Match";
import FinalMatch from "./FinalMatch";
import BracketConnector from "./BracketConnector";

interface Match {
  match: number;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

interface Round {
  round: number;
  matches: Match[];
}

interface Tournament {
  rounds: Round[];
}

interface TournamentBracketProps {
  tournament: Tournament;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournament,
}) => {
  const matchHeight = 160;
  const matchGap = 40;

  const getConnectorCount = (
    roundIndex: number,
    totalRounds: number,
    teamNumber: number,
    isReverse: boolean = false
  ): number => {
    const middleRound = Math.floor(totalRounds / 2) - (teamNumber > 16 ? 1 : 0);

    // Return 0 for the final round
    if (
      (roundIndex === totalRounds - 1 && !isReverse) ||
      (roundIndex === 0 && isReverse)
    ) {
      return 0;
    }

    if (roundIndex < middleRound) {
      return Math.pow(2, middleRound - roundIndex - 1);
    } else if (roundIndex > middleRound) {
      return Math.pow(2, roundIndex - middleRound);
    }
    return 1;
  };

  const getConnectorHeight = (roundIndex: number) => {
    const scale = Math.pow(2, roundIndex);
    return matchHeight * scale + matchGap * (scale - 1);
  };

  const totalTeams = tournament.rounds[0].matches.length * 2;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-12">
        {tournament.rounds.length > 0 && (
          <FinalMatch
            matchName={`Round ${
              tournament.rounds[tournament.rounds.length - 1].round
            }`}
            team1={
              tournament.rounds[tournament.rounds.length - 1].matches[0].team1
            }
            scoreTeam1={
              tournament.rounds[tournament.rounds.length - 1].matches[0].score1
            }
            team2={
              tournament.rounds[tournament.rounds.length - 1].matches[0].team2
            }
            scoreTeam2={
              tournament.rounds[tournament.rounds.length - 1].matches[0].score2
            }
          />
        )}
      </div>
      <div className="flex justify-center">
        <div className="flex">
          {/* Left side of the bracket */}
          {tournament.rounds.slice(0, -1).map((round, roundIndex) => (
            <div key={`left-${roundIndex}`} className="flex mr-12">
              <div className="flex flex-col justify-around pr-6">
                {round.matches
                  .slice(0, Math.floor(round.matches.length / 2))
                  .map((match, matchIndex) => (
                    <div key={matchIndex} className="mb-8">
                      <Match
                        matchName={`Round ${round.round} - Match ${match.match}`}
                        team1={match.team1}
                        scoreTeam1={match.score1}
                        team2={match.team2}
                        scoreTeam2={match.score2}
                      />
                    </div>
                  ))}
              </div>
              <div className="flex flex-col justify-around">
                {Array.from({
                  length: getConnectorCount(
                    tournament.rounds.length - 2 - roundIndex,
                    tournament.rounds.length - 1,
                    totalTeams,
                    true
                  ),
                }).map((_, index) => {
                  const connectorHeight = getConnectorHeight(roundIndex);
                  return (
                    <BracketConnector key={index} height={connectorHeight} />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Right side of the bracket (reversed) */}
          {tournament.rounds
            .slice(0, -1)
            .reverse()
            .map((round, roundIndex) => (
              <div key={`right-${roundIndex}`} className="flex ml-12">
                <div className="flex flex-col justify-around pr-6">
                  {Array.from({
                    length: getConnectorCount(
                      roundIndex,
                      tournament.rounds.length - 1,
                      totalTeams,
                      true
                    ),
                  }).map((_, index) => {
                    const connectorHeight = getConnectorHeight(
                      tournament.rounds.length - 2 - roundIndex
                    );
                    return (
                      <BracketConnector
                        key={index}
                        height={connectorHeight}
                        reverse={true}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col justify-around">
                  {round.matches
                    .slice(Math.floor(round.matches.length / 2))
                    .map((match, matchIndex) => (
                      <div key={matchIndex} className="mb-8">
                        <Match
                          matchName={`Round ${round.round} - Match ${match.match}`}
                          team1={match.team1}
                          scoreTeam1={match.score1}
                          team2={match.team2}
                          scoreTeam2={match.score2}
                          isReversed={true}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
