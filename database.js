import sql from "sqlite3";
const sqlite3 = sql.verbose();

// Open the db
async function openDB() {
    let db = new sqlite3.Database("./db/canvases.db", err => {
        if (err) {
            console.error(err.message);
            exit(-1);
        }
    });
    return db;
}

function closeDB(db) {
    db.close(err => {
        if (err) {
            console.error(err.message);
            exit(-1)
        }
    })
}

// Function for inserting a new canvas string
export async function insertCanvas(canvas_str) {
    // Open db
    let db = await openDB();

    db.serialize(() => {
        // Insert the canvas string into db
        let insertSQL = `INSERT INTO canvases(canvas_string) VALUES(?)`;

        db.run(insertSQL, [canvas_str], err => {
            if (err) return console.error(err.message);
        });

        closeDB(db);
    });
}

// Get the latest canvas
export function fetchLastCanvas() {
    return new Promise(async (resolve, reject) => {
        let db = await openDB();

        db.serialize(async () => {
            db.get('SELECT * FROM canvases ORDER BY canvas_id DESC LIMIT 1', [],
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        closeDB(db);
                        reject();
                    }
                    closeDB(db);
                    resolve({canvasStr: row.canvas_string});
                })
        });

    })
}