import puppeteer from "puppeteer"
import Utils from "../utils/Utils.js"

async function searchRenner(page, produto, conditional) {
  await page.goto("https://www.lojasrenner.com.br", {
    waitUntil: "load",
  })

  const searchElement =
    "#__next > div > div.content > div.header-content > header > div.main-content > div.wrap > div > form > div > input"
  await page.type(searchElement, produto)
  await page.click(searchElement)
  await page.keyboard.press("Enter")

  await page.waitForSelector(".ProductBox_productBoxContent__DAUwH", {
    timeout: 10000,
  })

  await Utils.scrollToBottom(page)

  const results = await page.evaluate(() => {
    const products = Array.from(
      document.querySelectorAll(".ProductBox_productBoxContent__DAUwH")
    ).slice(0, 36)

    return products.map((el) => {
      const img =
        el.querySelector("img")?.getAttribute("src") ||
        el.querySelector("img")?.getAttribute("data-src") ||
        null

      const name =
        el.querySelector(".ProductBox_title__x9UGh")?.innerText || null

      const price =
        el.querySelector(".ProductBox_price__d7hDK span")?.innerText?.trim() ||
        null

      const link = el.querySelector("a")?.href || null

      return { img, name, price, link }
    })
  })

  return Utils.applyConditional(results, conditional)
}

export default searchRenner
