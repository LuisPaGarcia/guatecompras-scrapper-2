//@ts-check
const puppeteer = require("puppeteer");
const years = require("./config/years");
const write = require("./logger/write");
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const init = async () => {
  try {
    // Arrancar chrome
    const browser = await puppeteer.launch({
      // headless: false,
      executablePath:
        "./node_modules/puppeteer/.local-chromium/chrome-win/chrome-win/chrome.exe",
    });

    // Abre una nueva pestaña
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    return { page, browser };
  } catch (error) {
    console.log(error);
  }
};

const firstStep = async (page) => {
  try {
    const YEAR = process.argv[2];
    // Load the initial URL
    await page.goto(
      "https://www.guatecompras.gt/reportes/Rpt_PublicacionesNPGModalidad.aspx"
    );

    // Wait until the config table has been loaded
    await page.waitForSelector(
      "#aspnetForm > div.container-fluid > div:nth-child(10)"
    );

    // Set the search values
    await page.select("#MasterGC_ContentBlockHolder_ddlAnioA", YEAR);
    await page.select("#MasterGC_ContentBlockHolder_ddlTipoEntidad", "1");
    await page.waitForSelector(
      "#MasterGC_ContentBlockHolder_ddlSubTipoEntidad > option:nth-child(3)"
    );
    await page.select("#MasterGC_ContentBlockHolder_ddlSubTipoEntidad", "6");
    await page.click("#MasterGC_ContentBlockHolder_BtnBuscar");
    await page.waitForSelector(
      "#MasterGC_ContentBlockHolder_gvResultado > tbody"
    );

    // Add localStorage to ovoid captcha
    await page.evaluate(() => {
      localStorage.setItem(
        "trustedsite_visit",
        JSON.stringify({ value: 1, expiry: 1652861739 })
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const scrapp = async ({ page }) => {
  try {
    const urls = await page.evaluate(function treat() {
      return Array.from(
        document.querySelectorAll(
          "#MasterGC_ContentBlockHolder_gvResultado > tbody > .FilaTablaDetalle > td:nth-child(2) > a"
        ),
        (e) => e.href || ""
      );
    });

    return urls;
  } catch (error) {}
};

const main = async () => {
  // Validate year input
  const YEAR = process.argv[2];
  if (!years.includes(YEAR)) {
    console.error("Year param is outside year limit: ", years);
    process.exit();
  }

  try {
    const { page, browser } = await init();
    await firstStep(page);
    let content = [];
    content = await scrapp({ page });
    await write({ filename: `${YEAR}.json`, content });
    // 2,3,4,5,6,7,8,9,10,...,12,13 // rendered name
    // 3,4,5,6,7,8,9,10,11,12,11,12, (13) // index name
    const pages = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 12, 13];
    for (const index of pages) {
      content = [];
      const query = `#MasterGC_ContentBlockHolder_gvResultado > tbody > tr.FooterTablaDetalle > td > table > tbody > tr > td:nth-child(${index}) > a`;
      const pageExists = await page.evaluate((query) => {
        return document.querySelector(query);
      }, query);

      if (pageExists) {
        await page.click(query);
        await page.waitForSelector(
          "#MasterGC_ContentBlockHolder_gvResultado > tbody"
        );
        content = await scrapp({ page });
      }

      // save in json
      await write({ filename: `${YEAR}.json`, content });
      console.log("finish", index, "page");
    }

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

module.exports = main;
