import puppeteer from "puppeteer"
import Utils from "../utils/Utils.js"

async function searchCea(page, produto, conditional) {
  await page.goto("https://www.cea.com.br/", { waitUntil: "networkidle2" })

  await page.type(".aa-Input", produto)
  await page.keyboard.press("Enter")

  // Espera os produtos carregarem
  await page.waitForSelector("ol.ais-Hits-list > li.ais-Hits-item", {
    timeout: 10000,
  })
  await Utils.sleep(3000)
  await Utils.scrollToBottom(page)

  const results = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll("ol.ais-Hits-list > li.ais-Hits-item")
    ).slice(0, 20)

    return items
      .map((item) => {
        const name =
          item.querySelector("h3.productName")?.innerText?.trim() || null
        const priceRaw = item.querySelector("p.spotPrice")?.innerText || null
        const price = priceRaw ? priceRaw.replace(/\s/g, "") : null
        const link = item.querySelector("a")?.href || null
        const img = item.querySelector("img")?.src || null

        return { name, price, link, img }
      })
      .filter((p) => p.price !== null)
  })

  return Utils.applyConditional(results, conditional)
}

export default searchCea
