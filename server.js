const express = require("express")
const app = express()
const pg = require("pg")
const client = new pg.Client( "postgres://localhost/acme_notes_categories_db" || process.env.DATABASE)
app.use(express.json())
app.use(require("morgan")("dev"))

// CREATE
app.post('/api/notes', async (req, res, next) => {
	try {
		const SQL = `
        INSERT INTO notes
		  (txt, created_at, updated_at, ranking, category_id)
		  VALUES
		  ($1, now() , now(), $2, $3);
    `
		const response = await client.query(SQL, [req.body.txt, req.body.ranking, req.body.category_id])
		res.send(response.rows[0])
	} catch (error) {
		next(error)
	}
})

// READ
app.get("/api/categories", async (req, res, next) => {
	try {
		const SQL = `
        SELECT *
        FROM categories
    `
		const response = await client.query(SQL)
		res.send(response.rows)
	} catch (error) {
		next(error)
	}
})

app.get("/api/notes", async (req, res, next) => {
	try {
		const SQL = `
        SELECT *
        FROM notes
    `
		const response = await client.query(SQL)
		res.send(response.rows)
	} catch (error) {
		next(error)
	}
})

// UPDATE
app.put("/api/notes/:id", async (req, res, next) => {
	try {
		const SQL = `
        UPDATE notes
		  SET txt=$1, ranking=$2, category_id=$3, updated_at=now() 
		  WHERE id=$4
		  RETURNING *;
    `
		const response = await client.query(SQL , [req.body.txt, req.body.ranking, req.body.category_id, req.params.id])
		res.send(response.rows[0])
	} catch (error) {
		next(error)
	}
})
// DELETE
app.delete("/api/notes/:id", async (req, res, next) => {
	try {
		const SQL = `
        DELETE FROM notes
		  WHERE id=$1
    `
		await client.query(SQL , [req.params.id])
		res.sendStatus(204)
	} catch (error) {
		next(error)
	}
})

const init = async (req, res, next) => {
	// Make a connection
	await client.connect()

	// Create the tables
	let SQL = `

        DROP TABLE IF EXISTS notes;
        DROP TABLE IF EXISTS categories;

        CREATE TABLE categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL
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
        INSERT INTO categories (name) VALUES ('animal');


        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'Potato',
            1 , 
            (SELECT id FROM categories WHERE name='food')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'Shawshank Redemption',
            3 , 
            (SELECT id FROM categories WHERE name='movie')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'LEGO',
            4 , 
            (SELECT id FROM categories WHERE name='toy')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'cat',
            3 , 
            (SELECT id FROM categories WHERE name='animal')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'Pickle',
            4 , 
            (SELECT id FROM categories WHERE name='food')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'Star Wars',
            2 , 
            (SELECT id FROM categories WHERE name='movie')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'Transformers',
            1 , 
            (SELECT id FROM categories WHERE name='toy')
        );
        INSERT INTO notes (txt, ranking, category_id) VALUES (
            'dog',
            5 , 
            (SELECT id FROM categories WHERE name='animal')
        );

    `;
	await client.query(SQL)

	// Create a port & listen
	const PORT = 3000
	app.listen(PORT, () => {
		console.log(`Listening at PORT: ${PORT}`)
	})
}

init()
