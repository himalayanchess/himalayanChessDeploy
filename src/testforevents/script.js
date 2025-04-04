const axios = require('axios');
const cheerio = require('cheerio');

async function getChessResultsJson(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Debug: Log key HTML structures
    console.log("Debugging selectors...");
    console.log("Tournament title:", $('h2').first().text().trim());
    console.log("First player row:", $('.CRs').first().text().trim().substring(0, 100) + "...");
    
    // Extract tournament info
    const tournament = {
      name: $('h2').first().text().trim().replace('Player info', '').trim(),
      federation: getNextTdText($, 'Federation'),
      director: getNextTdText($, 'Tournament director'),
      chiefArbiter: getNextTdText($, 'Chief Arbiter'),
      timeControl: getNextTdText($, 'Time control'),
      location: getNextTdText($, 'Location'),
      rounds: parseInt(getNextTdText($, 'Number of rounds')) || null,
      type: getNextTdText($, 'Tournament type'),
      ratingCalculation: getNextTdText($, 'Rating calculation'),
      dates: getNextTdText($, 'Date'),
      averageRating: parseFloat(getNextTdText($, 'Rating-Ø')) || null
    };

    // Extract players
    const players = [];
    $('.CRs').each((i, row) => {
      const $row = $(row);
      players.push({
        rank: $row.find('.CRrk').text().trim(),
        name: $row.find('.CRn').text().trim(),
        federation: $row.find('.CRf').text().trim(),
        club: $row.find('.CRt').text().trim(),
        fideId: $row.find('.CRfideID').text().trim(),
        rating: $row.find('.CRelo').text().trim(),
        points: parseFloat($row.find('.CRp').text().trim().replace(',', '.')) || 0,
        rounds: extractRounds($row)
      });
    });

    return { tournament, players };

  } catch (error) {
    console.error("Scraping failed:", error.message);
    return { error: "Failed to scrape data", details: error.message };
  }
}

// Helper functions
function getNextTdText($, label) {
  return $(`td:contains('${label}')`).next().text().trim();
}

function extractRounds($row) {
  const rounds = [];
  $row.find('.CRr').each((i, cell) => {
    const $cell = $(cell);
    const result = convertResult($cell.text().trim());
    if (result !== null) {
      rounds.push({
        round: i + 1,
        result,
        opponent: $cell.attr('title') || ''
      });
    }
  });
  return rounds;
}

function convertResult(result) {
  const map = { '1': 1, '½': 0.5, '0': 0, '+': 1, '-': 0, '=': 0.5 };
  return map[result] ?? null;
}

// Usage
const url = 'https://chess-results.com/tnr1130041.aspx?lan=1&art=9&fed=NEP&turdet=YES&snr=1';
getChessResultsJson(url).then(json => {
  console.log(JSON.stringify(json, null, 2));
});