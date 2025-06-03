const express = require("express")
const app = express()
const pg = require("pg")
const client = new pg.Client("postgres://localhost/acme_notes_categories_db" || process.env.DATABASE)

const init = () => {

    // Make a connection
    // Create the tables

    // Create a port & listen
    const PORT = 3000
    app.listen(PORT , () => {
        console.log(`Listening at PORT: ${PORT}`)
    })

}