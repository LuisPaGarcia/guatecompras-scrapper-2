const puppeteer = require("puppeteer");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath:
        "./node_modules/puppeteer/.local-chromium/chrome-win/chrome-win/chrome.exe",
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 800,
    });

    await page.goto(
      "https://www.guatecompras.gt/reportes/Rpt_PublicacionesNPGModalidad.aspx"
    );

    await page.waitForSelector(
      "#aspnetForm > div.container-fluid > div:nth-child(10)"
    );

    await page.evaluate(() => {
      localStorage.setItem(
        "trustedsite_visit",
        JSON.stringify({ value: 1, expiry: 1652861739 })
      );
    });

    await page.select("#MasterGC_ContentBlockHolder_ddlAnioA", "2011");
    await page.select("#MasterGC_ContentBlockHolder_ddlTipoEntidad", "1");
    await delay(2000);
    await page.select("#MasterGC_ContentBlockHolder_ddlSubTipoEntidad", "6");
    await page.click("#MasterGC_ContentBlockHolder_BtnBuscar");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const data = [];

    const municipios = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#MasterGC_ContentBlockHolder_gvResultado > tbody > .FilaTablaDetalle > td:nth-child(1) > a"
        ),
        (e) => e.innerText
      )
    );

    const urls = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#MasterGC_ContentBlockHolder_gvResultado > tbody > .FilaTablaDetalle > td:nth-child(2) > a"
        ),
        (e) => e.href || ""
      )
    );

    for (var index = 0; index < municipios.length; index++) {
      data.push({
        municipio: municipios[index],
        url: urls[index],
      });
    }
    console.log(data);

    await page.screenshot({
      path: "yoursite.png",
      fullPage: true,
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
