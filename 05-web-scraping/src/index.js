import jsdom from "jsdom";
import fetch from "isomorphic-fetch"
import puppeteer from "puppeteer"

console.log("Hello World!")



//faire un screenshot d'une page web avec puppeteer
async function screenshot(url) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: "screenshot.png" });
    await browser.close();
}

screenshot("https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops");


