const sqlite3 = require('sqlite3').verbose();

class Recipe {
    constructor(id, title, ingredients, instructions, authorId, image) {
        this.id = id;
        this.title = title;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.authorId = authorId;
        this.image = image;
    }

    static findById(id, cb) {
        const db = new sqlite3.Database('database.sqlite');
        db.get(`SELECT * FROM recipes WHERE id = ?`, id, function(err, row) {
            db.close();
            if (err) {
                return cb(err);
            }
            if (!row) {
                return cb(null, null);
            }
            const recipe = new Recipe(row.id, row.title, row.ingredients, row.instructions, row.author_id, row.image);
            cb(null, recipe);
        });
    }
}

module.exports = Recipe;
