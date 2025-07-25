import puppeteer from "puppeteer"
import axios from "axios"
import Utils from "./utils/Utils.js"
import searchRenner from "./sites/renner.js"
import searchRiachuelo from "./sites/riachuelo.js"
import searchCea from "./sites/c&a.js"
import searchAmazon from "./sites/amazon.js"
  
// Mapeamento dos sites
const siteHandlers = {
  renner: searchRenner,
  riachuelo: searchRiachuelo,
  cea: searchCea,
  amazon: searchAmazon,
}

async function execSearch(site, produto, conditional) {
  const browser = await Utils.launchBrowser()
  try {
    const [page] = await browser.pages()
    const handler = siteHandlers[site.toLowerCase()]

    if (!handler) throw new Error("Site não suportado")

    const results = await handler(page, produto, conditional)
    return results
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await browser.close()
  }
}

export default execSearch
