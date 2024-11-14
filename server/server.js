const express = require('express');
const app = express();
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const puppeteer = require('puppeteer');
const babel = require('@babel/core');
const { VM } = require('vm2');
const fs = require('fs').promises;
const path = require('path');

app.use(express.json());

// Fonction pour rendre le composant en HTML
async function renderComponentToHTML(componentCode, props) {
  // Transpile the code (TypeScript or JavaScript)
  const transpiledCode = babel.transformSync(componentCode, {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    filename: 'components.tsx',
  }).code;

  // Create a mock module
  const mockModule = { exports: {} };

  // Create a mock require function
  const mockRequire = (moduleName) => {
    if (moduleName === 'react') return React;
    throw new Error(`Unable to mock module: ${moduleName}`);
  };

  // Use VM2 to execute the code safely
  const vm = new VM({
    sandbox: { 
      React, 
      require: mockRequire,
      module: mockModule,
      exports: mockModule.exports
    },
    timeout: 5000
  });

  vm.run(`
    ${transpiledCode}
    module.exports = React.createElement(module.exports.default || module.exports.BracketRenderer, ${JSON.stringify(props)});
  `);

  // Extract the rendered element from module.exports
  const renderedElement = mockModule.exports;

  if (!renderedElement) {
    throw new Error('No component found in the exported module');
  }

  return ReactDOMServer.renderToStaticMarkup(renderedElement);
}

// Fonction pour générer le PNG à partir du HTML
let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

// Update the renderHTMLToPNG function
async function renderHTMLToPNG(html, viewport = { width: 1920, height: 1080 }) {
  console.log('Starting renderHTMLToPNG');
  const browser = await getBrowser();
  console.log('Browser instance obtained');
  const page = await browser.newPage();
  console.log('New page created');

  try {
    await page.setViewport(viewport);
    console.log('Viewport set');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('Content set on page');

    const screenshotBuffer = await page.screenshot({ omitBackground: true });
    console.log('Screenshot taken');

    return screenshotBuffer;
  } catch (error) {
    console.error('Error in renderHTMLToPNG:', error);
    throw error;
  } finally {
    await page.close();
    console.log('Page closed');
  }
}

// Fermer le navigateur lors de la fermeture du serveur
process.on('exit', async () => {
  if (browser) await browser.close();
});

// Add this function at the top of the file, outside of any existing functions
function getScale(roundCount) {
  const baseScale = 1;
  const scaleCoefficient = 0.12;
  return Math.max(baseScale - (roundCount - 1) * scaleCoefficient, 0.1);
}

// Helper function to generate random team names
function generateTeamName() {
  const prefixes = ['Team', 'Squad', 'Legion', 'Dragons', 'Knights'];
  const suffixes = ['Alpha', 'Beta', 'Delta', 'Omega', 'Prime', 'Elite'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

// Helper function to generate random score
function generateScore() {
  return Math.floor(Math.random() * 5);
}

// Function to generate tournament structure based on number of participants
function generateTournamentData(participantCount) {
  // Validate and adjust participant count to nearest power of 2
  const validParticipantCounts = [4, 8, 16, 32];
  const actualCount = validParticipantCounts.reduce((prev, curr) => 
    Math.abs(curr - participantCount) < Math.abs(prev - participantCount) ? curr : prev
  );

  const rounds = Math.log2(actualCount);
  const tournament = {
    name: `Example Tournament (${actualCount} participants)`,
    rounds: []
  };

  // Generate first round with all initial matches
  let currentRoundMatches = actualCount / 2;
  let matchCounter = 1;

  // Generate all rounds
  for (let round = 1; round <= rounds; round++) {
    const matches = [];
    
    for (let match = 0; match < currentRoundMatches; match++) {
      if (round === 1) {
        // First round has all teams
        matches.push({
          match: matchCounter++,
          team1: generateTeamName(),
          team2: generateTeamName(),
          score1: generateScore(),
          score2: generateScore()
        });
      } else {
        // Subsequent rounds have placeholder teams that would advance
        matches.push({
          match: matchCounter++,
          team1: generateTeamName(),
          team2: generateTeamName(),
          score1: generateScore(),
          score2: generateScore()
        });
      }
    }

    tournament.rounds.push({
      round: round,
      matches: matches
    });

    currentRoundMatches = currentRoundMatches / 2;
  }

  return tournament;
}

// Update this route to use POST and accept tournament data in the body
app.post('/export-bracket', express.json(), async (req, res) => {
  try {
    console.log('Starting /export-bracket route');

    // Validate the incoming tournament data
    const tournament = req.body;
    if (!tournament || !tournament.name || !Array.isArray(tournament.rounds)) {
      return res.status(400).send('Invalid tournament data');
    }

    // Read all necessary component files
    const componentsPath = path.join(__dirname, '..', 'src', 'components');
    const [bracketRendererCode, tournamentBracketCode, matchCode, finalMatchCode, labelCode, bracketConnectorCode] = await Promise.all([
      fs.readFile(path.join(componentsPath, 'BracketRenderer.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'TournamentBracket.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'Match.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'FinalMatch.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'Label.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'BracketConnector.tsx'), 'utf-8')
    ]);
    console.log('All component files read successfully');

    // Read the Tailwind CSS file
    const tailwindCSS = await fs.readFile(path.join(__dirname, '..', 'dist', 'tailwind.css'), 'utf-8');
    console.log('Tailwind CSS file read successfully');

    // Combine all component codes
    const combinedComponentCode = `
      import React from 'react';
      ${bracketConnectorCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${labelCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${matchCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${finalMatchCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${tournamentBracketCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${bracketRendererCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
    `;

    // Calculate scale and blurAmount based on the number of rounds
    const scale = getScale(tournament.rounds.length);
    const blurAmount = tournament.rounds.length > 3 ? "0.3px" : "0.5px";

    // Render the component to HTML with calculated scale and blurAmount
    let html;
    try {
      html = await renderComponentToHTML(combinedComponentCode, { tournament: tournament, scale: scale, blurAmount: '0px' });
      console.log('HTML generated successfully');
    } catch (renderError) {
      console.error('Error rendering component to HTML:', renderError);
      return res.status(500).send(`Error rendering component: ${renderError.message}`);
    }

    // Wrap the component HTML in a full HTML document
    const fullHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${tailwindCSS}
            body {
              background-image: url('data:image/png;base64,${await fs.readFile(path.join(__dirname, 'bg-bracket.png'), 'base64')}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Generate the PNG with a specific viewport size
    let pngBuffer;
    try {
      pngBuffer = await renderHTMLToPNG(fullHtml, { width: 1920, height: 1080 });
      console.log('PNG buffer generated successfully');
    } catch (pngError) {
      console.error('Error generating PNG:', pngError);
      return res.status(500).send(`Error generating PNG: ${pngError.message}`);
    }

    // Send the PNG buffer directly as response
    res.set('Content-Type', 'image/png');
    res.send(pngBuffer);
    console.log('PNG buffer sent as response');
  } catch (error) {
    console.error('Error in /export-bracket route:', error);
    res.status(500).send(`Error exporting BracketRenderer component as PNG: ${error.message}`);
  }
});

// Route to generate example tournament bracket
app.get('/generate-example/:participants', async (req, res) => {
  try {
    const participantCount = parseInt(req.params.participants);
    
    // Validate participant count
    if (isNaN(participantCount) || participantCount < 4 || participantCount > 32) {
      return res.status(400).json({
        error: 'Invalid participant count. Please provide a number between 4 and 32.'
      });
    }

    // Generate tournament data
    const tournament = generateTournamentData(participantCount);

    // Generate the bracket image using existing functionality
    const componentsPath = path.join(__dirname, '..', 'src', 'components');
    const [bracketRendererCode, tournamentBracketCode, matchCode, finalMatchCode, labelCode, bracketConnectorCode] = await Promise.all([
      fs.readFile(path.join(componentsPath, 'BracketRenderer.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'TournamentBracket.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'Match.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'FinalMatch.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'Label.tsx'), 'utf-8'),
      fs.readFile(path.join(componentsPath, 'BracketConnector.tsx'), 'utf-8')
    ]);

    // Read the Tailwind CSS file
    const tailwindCSS = await fs.readFile(path.join(__dirname, '..', 'dist', 'tailwind.css'), 'utf-8');

    // Combine all component codes
    const combinedComponentCode = `
      import React from 'react';
      ${bracketConnectorCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${labelCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${matchCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${finalMatchCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${tournamentBracketCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
      ${bracketRendererCode.replace(/import React from ["']react["'];?/g, '').replace(/import .* from ["'].\/.+["'];?/g, '')}
    `;

    const scale = getScale(tournament.rounds.length);
    const html = await renderComponentToHTML(combinedComponentCode, { 
      tournament: tournament, 
      scale: scale, 
      blurAmount: '0px' 
    });

    // Create full HTML document
    const fullHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${tailwindCSS}
            body {
              background-image: url('data:image/png;base64,${await fs.readFile(path.join(__dirname, 'bg-bracket.png'), 'base64')}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Generate PNG
    const pngBuffer = await renderHTMLToPNG(fullHtml, { width: 1920, height: 1080 });

    // Send response
    res.set('Content-Type', 'image/png');
    res.send(pngBuffer);

  } catch (error) {
    console.error('Error generating example tournament:', error);
    res.status(500).json({ error: 'Failed to generate example tournament' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
