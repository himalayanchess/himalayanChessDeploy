import axios from "axios";
import * as cheerio from "cheerio";

export async function getFideData(fideId: string | number) {
  try {
    const url = `https://ratings.fide.com/profile/${fideId}`;

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    };

    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);

    // Check for invalid profiles
    if ($("title").text().includes("Page not found")) {
      return null;
    }

    // Extract main player data
    const name = $(".profile-top-title").text().trim();
    const title = $(".profile-top-info__block__data--title").text().trim();
    const federation = $(".profile-top-info__block__data--federation")
      .text()
      .trim();
    const gender = $(".profile-top-info__block__data--gender").text().trim();
    const birthYear = $(".profile-top-info__block__data--birthday")
      .text()
      .trim()
      .match(/\d{4}/)?.[0];

    // Extract ratings
    const ratings = {
      standard:
        $(
          '.profile-top-rating-data:contains("Std") .profile-top-rating-data__value'
        )
          .text()
          .trim() || "Not rated",
      rapid:
        $(
          '.profile-top-rating-data:contains("Rapid") .profile-top-rating-data__value'
        )
          .text()
          .trim() || "Not rated",
      blitz:
        $(
          '.profile-top-rating-data:contains("Blitz") .profile-top-rating-data__value'
        )
          .text()
          .trim() || "Not rated",
    };

    // Extract additional info from tables
    const additionalInfo: Record<string, string> = {};
    $(".profile-table tr").each((_, row) => {
      const key = $(row).find("td:nth-child(1)").text().trim().replace(":", "");
      const value = $(row).find("td:nth-child(2)").text().trim();
      if (key && value) {
        additionalInfo[key] = value;
      }
    });

    // Extract player photo
    const photoPath = $(".profile-top__photo img").attr("src");
    const photoUrl = photoPath ? `https://ratings.fide.com${photoPath}` : null;

    return {
      name,
      fideId,
      title,
      federation,
      gender,
      birthYear,
      ratings,
      additionalInfo,
      photoUrl,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error(`Error fetching FIDE data for ${fideId}:`, error.message);
    return {
      error: true,
      message: error.message,
      fideId,
    };
  }
}
