import puppeteer from "puppeteer"
import Utils from "../utils/Utils.js"

async function searchAmazon(page, produto, conditional) {
  await page.goto("https://www.amazon.com.br/", { waitUntil: "networkidle2" })

  const keepBuying = await page.$(".a-button-text")
  if (keepBuying) {
    await page.click(".a-button-text")
  }
  await page.type("#twotabsearchtextbox ", produto)
  await page.keyboard.press("Enter")

  // Espera os produtos carregarem
  await page.waitForSelector('[data-component-type="s-search-result"]', {
    timeout: 10000,
  })
  await Utils.sleep(3000)
  await Utils.scrollToBottom(page)

  const results = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll(".s-main-slot .s-result-item")
    ).filter(
      (item) =>
        item.querySelector(".a-price-whole") &&
        item.querySelector(".a-price-fraction")
    )

    return items.slice(0, 20).map((item) => {
      const img = item.querySelector("img")?.src || null
      const name = item.querySelector("h2 span")?.innerText?.trim() || null

      const whole =
        item.querySelector(".a-price-whole")?.innerText.replace(/[^\d]/g, "") ||
        "0"
      const fraction =
        item
          .querySelector(".a-price-fraction")
          ?.innerText.replace(/[^\d]/g, "") || "00"
      const price = `${whole},${fraction}`
      const titleElement = item.querySelector("h2 a")
      const link = titleElement
        ? "https://www.amazon.com.br" + titleElement.getAttribute("href")
        : null

      return { img, name, price, link }
    })
  })

  return Utils.applyConditional(results, conditional)
}

export default searchAmazon
