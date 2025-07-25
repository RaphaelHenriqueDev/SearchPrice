import express from "express"
import "dotenv/config"
import execSearch from "./app.js"

const app = express()

app.get(
  ["/app/:site/:produto/:conditional", "/app/:site/:produto"],
  async (req, res) => {
    const { site, produto, conditional } = req.params

    try {
      const response = await execSearch(site, produto, conditional)
      return res.send(response)
    } catch (err) {
      const currentDate = new Date()
      const dataIso = currentDate.toISOString()
      const payload = {
        Status: 500,
        DateTime: dataIso,
        HasErrors: true,
        MustRetry: true,
        Error: {
          Message: err?.message || err,
          Details: "",
          StackTrace: "",
        },
      }
      console.log(err.message)
      return res.status(500).send(payload)
    }
  }
)
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Servidor Rodando na porta: ${PORT}`))
