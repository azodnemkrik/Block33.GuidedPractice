const express = require("express")
const app = express()
const pg = require("pg")
const client = new pg.Client("postgres://localhost/acme_notes_categories_db" || process.env.DATABASE)

const init = async (req,res,next) => {
    // Make a connection
    await client.connect()

    // Create the tables
    let SQL = `

        DROP TABLE IF EXISTS notes;
        DROP TABLE IF EXISTS categories;

        CREATE TABLE categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
        );

        CREATE TABLE notes(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            txt VARCHAR(50),
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            ranking DEFAULT 3 NOT NULL,
            category_id DEFAULT 3 NOT NULL
        );
        

    `

    // Create a port & listen
    const PORT = 3000
    app.listen(PORT , () => {
        console.log(`Listening at PORT: ${PORT}`)
    })

}