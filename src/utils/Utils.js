import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import userPrefs from "puppeteer-extra-plugin-user-preferences"
import axios from "axios"

export default class Utils {
  /**
   * Função que inicia um browser
   * @param {boolean} headlessMode - Define se o navegador será iniciado em modo headless.
   * @param {Array} args - Argumentos adicionais para configuração do navegador.
   */
  static async launchBrowser(headlessMode = false, args = []) {
    puppeteer.use(StealthPlugin())
    puppeteer.use(userPrefs({}))
    const browser = await puppeteer.launch({
      headless: headlessMode,
      ignoreHTTPSErrors: true,
      args: args,
      slowMo: 10,
    })
    return browser
  }
  /**
   * Aplica uma ordenação condicional aos resultados.
   * @param {Array} results - Array de objetos contendo os resultados.
   * @param {string} conditional - Condição de ordenação ('mais baratos', 'mais modestos', etc).
   * @returns {Array} - Array ordenado conforme a condição.
   */
  static async applyConditional(results, conditional) {
    if (!conditional || !Array.isArray(results)) return results

    const parsed = results.map((item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(
              item.price
                .replace(/[^\d,]/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
            )
          : 0
      return { ...item, priceNumber: price }
    })

    let sorted
    if (conditional.toLowerCase() === "mais_baratos") {
      sorted = parsed.sort((a, b) => a.priceNumber - b.priceNumber)
    } else if (conditional.toLowerCase() === "mais_modestos") {
      sorted = parsed.sort((a, b) => b.priceNumber - a.priceNumber)
    } else {
      return results
    }

    return sorted.slice(0, 5)
  }
  /**
   * Realiza scroll até o final da página para carregar conteúdos com lazy loading.
   * @param {object} page - Instância da página do Puppeteer.
   */
  static async scrollToBottom(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0
        const distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance

          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })
  }
  /**
   * Pausa a execução por um período de tempo especificado.
   * @param {number} ms - Tempo em milissegundos para aguardar.
   * @returns {Promise<void>} Uma promessa que resolve após o tempo especificado.
   */
  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
