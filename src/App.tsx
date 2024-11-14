import React from "react";
import BracketRenderer from "./components/BracketRenderer";

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

export interface Tournament {
  rounds: Round[];
  name?: string; // Add this line to include the tournament name
}

const tournament: Tournament = {
  rounds: [
    {
      round: 1,
      matches: [
        {
          match: 1,
          team1: "Team A",
          team2: "Team B",
          score1: 3,
          score2: 1,
        },
        {
          match: 2,
          team1: "Team C",
          team2: "Team D",
          score1: 2,
          score2: 2,
        },
        {
          match: 3,
          team1: "Team E",
          team2: "Team F",
          score1: 0,
          score2: 1,
        },
        {
          match: 4,
          team1: "Team G",
          team2: "Team H",
          score1: 4,
          score2: 3,
        },
        {
          match: 5,
          team1: "Team I",
          team2: "Team J",
          score1: 1,
          score2: 0,
        },
        {
          match: 6,
          team1: "Team K",
          team2: "Team L",
          score1: 2,
          score2: 1,
        },
        {
          match: 7,
          team1: "Team M",
          team2: "Team N",
          score1: 3,
          score2: 3,
        },
        {
          match: 8,
          team1: "Team O",
          team2: "Team P",
          score1: 0,
          score2: 2,
        },
        {
          match: 9,
          team1: "Team Q",
          team2: "Team R",
          score1: 1,
          score2: 2,
        },
        {
          match: 10,
          team1: "Team S",
          team2: "Team T",
          score1: 2,
          score2: 0,
        },
        {
          match: 11,
          team1: "Team U",
          team2: "Team V",
          score1: 3,
          score2: 1,
        },
        {
          match: 12,
          team1: "Team W",
          team2: "Team X",
          score1: 2,
          score2: 3,
        },
        {
          match: 13,
          team1: "Team Y",
          team2: "Team Z",
          score1: 1,
          score2: 0,
        },
        {
          match: 14,
          team1: "Team AA",
          team2: "Team AB",
          score1: 0,
          score2: 1,
        },
        {
          match: 15,
          team1: "Team AC",
          team2: "Team AD",
          score1: 2,
          score2: 2,
        },
        {
          match: 16,
          team1: "Team AE",
          team2: "Team AF",
          score1: 3,
          score2: 0,
        },
      ],
    },
    {
      round: 2,
      matches: [
        {
          match: 1,
          team1: "Team A",
          team2: "Team C",
          score1: 1,
          score2: 2,
        },
        {
          match: 2,
          team1: "Team F",
          team2: "Team G",
          score1: 0,
          score2: 1,
        },
        {
          match: 3,
          team1: "Team I",
          team2: "Team K",
          score1: 3,
          score2: 2,
        },
        {
          match: 4,
          team1: "Team N",
          team2: "Team P",
          score1: 1,
          score2: 1,
        },
        {
          match: 5,
          team1: "Team R",
          team2: "Team S",
          score1: 2,
          score2: 0,
        },
        {
          match: 6,
          team1: "Team U",
          team2: "Team X",
          score1: 1,
          score2: 2,
        },
        {
          match: 7,
          team1: "Team Y",
          team2: "Team AB",
          score1: 0,
          score2: 1,
        },
        {
          match: 8,
          team1: "Team AC",
          team2: "Team AE",
          score1: 2,
          score2: 3,
        },
      ],
    },
    {
      round: 3,
      matches: [
        {
          match: 1,
          team1: "Team C",
          team2: "Team G",
          score1: 1,
          score2: 0,
        },
        {
          match: 2,
          team1: "Team I",
          team2: "Team N",
          score1: 2,
          score2: 1,
        },
        {
          match: 3,
          team1: "Team R",
          team2: "Team X",
          score1: 3,
          score2: 2,
        },
        {
          match: 4,
          team1: "Team AB",
          team2: "Team AE",
          score1: 1,
          score2: 0,
        },
      ],
    },
    {
      round: 4,
      matches: [
        {
          match: 1,
          team1: "Team C",
          team2: "Team I",
          score1: 2,
          score2: 3,
        },
        {
          match: 2,
          team1: "Team R",
          team2: "Team AB",
          score1: 1,
          score2: 1,
        },
      ],
    },
    {
      round: 5,
      matches: [
        {
          match: 1,
          team1: "Team I",
          team2: "Team R",
          score1: 1,
          score2: 2,
        },
      ],
    },
  ],
};

const App: React.FC = () => {
  // const [bgImage, setBgImage] = useState<string | null>(null);

  // useEffect(() => {
  //   // Import the background image dynamically
  //   import("../assets/bg-bracket.png").then((image) => {
  //     setBgImage(image.default);
  //   });
  // }, []);

  const getScale = (roundCount: number) => {
    const baseScale = 1;
    const scaleCoefficient = 0.12;
    return Math.max(baseScale - (roundCount - 1) * scaleCoefficient, 0.1);
  };

  const scale = getScale(tournament.rounds.length);
  const blurAmount = tournament.rounds.length > 3 ? "0.3px" : "0.5px";

  // const exportAsPNG = () => {
  //   if (bracketRef.current && bgImage) {
  //     const width = 1920;
  //     const height = 1080;
  //     const scaleFactor = 2; // Increase this for higher quality

  //     html2canvas(bracketRef.current, {
  //       scale: scale * scaleFactor,
  //       width: width,
  //       height: height,
  //       useCORS: true,
  //       allowTaint: true,
  //       onclone: (document, element) => {
  //         element.style.width = `${width}px`;
  //         element.style.height = `${height}px`;
  //         element.style.transform = "none";
  //         element.style.position = "static";
  //       },
  //     }).then((canvas) => {
  //       const finalCanvas = document.createElement("canvas");
  //       finalCanvas.width = width * scale * scaleFactor;
  //       finalCanvas.height = height * scale * scaleFactor;
  //       const ctx = finalCanvas.getContext("2d");
  //       if (ctx) {
  //         ctx.imageSmoothingEnabled = false; // Disable image smoothing for sharper text
  //         ctx.drawImage(
  //           bgImage,
  //           0,
  //           0,
  //           width * scale * scaleFactor,
  //           height * scale * scaleFactor
  //         );
  //         ctx.drawImage(canvas, 0, 0);
  //       }
  //       const link = document.createElement("a");
  //       link.download = "tournament-bracket.png";
  //       link.href = finalCanvas.toDataURL("image/png", 1.0); // Use maximum quality
  //       link.click();
  //     });
  //   }
  // };

  return (
    <BracketRenderer
      tournament={tournament}
      scale={scale}
      blurAmount={blurAmount}
    />
  );
};

export default App;
