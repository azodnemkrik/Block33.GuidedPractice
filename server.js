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
            txt VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            ranking INTEGER DEFAULT 3 NOT NULL,
            category_id INTEGER REFERENCES categories(id) NOT NULL
        );
        
        INSERT INTO categories (name) VALUES ('food');
        INSERT INTO categories (name) VALUES ('movie');
        INSERT INTO categories (name) VALUES ('toy');
        INSERT INTO categories (name) VALUES ('animalg');

                
        INSERT INTO notes (txt, ranking, category_id) VALUES ('Potato', 1 , (SELECT id FROM categories WHERE name='food'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('Shawshank Redemption', 3 , (SELECT id FROM categories WHERE name='movie'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('LEGO', 4 , (SELECT id FROM categories WHERE name='toy'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('cat', 3 , (SELECT id FROM categories WHERE name='animal'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('Pickle', 4 , (SELECT id FROM categories WHERE name='food'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('Star Wars', 2 , (SELECT id FROM categories WHERE name='movie'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('Transformers', 1 , (SELECT id FROM categories WHERE name='toy'));
        INSERT INTO notes (txt, ranking, category_id) VALUES ('dog', 5 , (SELECT id FROM categories WHERE name='animal'));

    `

    // Create a port & listen
    const PORT = 3000
    app.listen(PORT , () => {
        console.log(`Listening at PORT: ${PORT}`)
    })

}

init()