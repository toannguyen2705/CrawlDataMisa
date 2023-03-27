const scrapes = require("./scraper");
const scrapeController = async (browserInstance) => {
  const url = "https://asp.misa.vn/tim-ke-toan";
  try {
    let browser = await browserInstance;
    let categories = scrapes.scrapeCategory(browser, url);
  } catch (error) {
    console.log("Lỗi ở scrape controller: " + error);
  }
};

module.exports = scrapeController;
