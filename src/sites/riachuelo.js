import puppeteer from "puppeteer"
import Utils from "../utils/Utils.js"

async function searchRiachuelo(page, produto, conditional) {
  await page.goto(`https://www.riachuelo.com.br/busca?q=${produto}`, {
    waitUntil: "networkidle2",
  })

  await page.waitForSelector("ol.MuiGrid-root", { timeout: 10000 })
  await Utils.sleep(3000)
  await Utils.scrollToBottom(page)

  const results = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll("ol.MuiGrid-root > li")
    ).slice(0, 24)

    return items
      .map((item) => {
        const img = item.querySelector("img")?.src || null
        const name = item.querySelector("h3")?.innerText?.trim() || null
        const price =
          item.querySelector('[aria-label^="Por R$"]')?.innerText?.trim() ||
          null
        const link = item.querySelector("a")?.href || null

        return { img, name, price, link }
      })
      .filter((p) => p.price !== null)
  })

  return Utils.applyConditional(results, conditional)
}

export default searchRiachuelo
