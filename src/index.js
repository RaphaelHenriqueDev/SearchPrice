import express from "express"
import "dotenv/config"
import execSearch from "./app.js"

const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

//BACK-END
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
app.get(
  ["/:site/:produto/:conditional", "/:site/:produto"],
  async (req, res) => {
    const { site, produto, conditional } = req.params
    
    try {
      const items = await execSearch(site.toLowerCase(), produto, conditional)
      return res.status(200).render("resultsSearch", { items })
    } catch (err) {
      console.log(err.message)
      return res.status(500).render("home")
    }
  }
)
//FRONT-END
app.get("/", (req, res) => {
  res.render("home")
})
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Servidor Rodando na porta: ${PORT}`))
