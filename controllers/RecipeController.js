const Recipe = require("../models/RecipeModel");
const sqlite3 = require('sqlite3').verbose();

async function getRecipeById(recipeId) {
    const recipe = await Recipe.getById(recipeId);
    return recipe;
}


exports.getRecipes = (req, res) => {
    const db = new sqlite3.Database('database.sqlite');

    db.all('SELECT * FROM recipes', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching recipes');
        } else {
            const userId = req.user ? req.user._id : null;
            res.render('recipe', { recipes: rows, userId });
        }
        db.close();
    });
};

exports.detail = (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            console.log(err);
        } else {
            res.render('detail', {
                title: recipe.title,
                recipe: recipe,
                hasImage: recipe.image !== undefined && recipe.image !== null, // Check if the recipe has an image
            });
        }
    });
};


exports.getRecipe = (req, res, next) => {
    const db = new sqlite3.Database('database.sqlite');
    const recipeId = req.params.id;

    db.get(`SELECT * FROM recipes WHERE id = ?`, [recipeId], (err, recipe) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving recipe');
        } else if (!recipe) {
            res.status(404).send('Recipe not found');
        } else {
            res.render('recipe', { recipe, user: req.user });
        }
        db.close();
    });
};





exports.createRecipe = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).redirect('/login');
    }

    const db = new sqlite3.Database('database.sqlite');
    const { title, description, image } = req.body;

    console.log('Image:', image); // add this line

    db.run(`INSERT INTO recipes (title, description, image, userId) VALUES (?, ?, ?, ?)`, [title, description, image, req.user._id], function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error creating recipe');
        } else {
            const recipeId = this.lastID;
            res.redirect(`/recipes/${recipeId}`);
        }
        db.close();
    });
};



exports.editRecipe = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).redirect('/login');
    }
    const db = new sqlite3.Database('database.sqlite');
    const recipeId = req.params.id;

    db.get(`SELECT * FROM recipes WHERE id = ${recipeId}`, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching recipe');
        } else {
            if (row.userId !== req.user._id) {
                res.status(403).send('Unauthorized');
            } else {
                res.render('edit', { recipe: row });
            }
        }
        db.close();
    });
};

exports.updateRecipe = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).redirect('/login');
    }

    const db = new sqlite3.Database('database.sqlite');
    const recipeId = req.params.id;
    const { title, description, image } = req.body;

    console.log('Image:', image); // add this line

    db.run(`UPDATE recipes SET title = ?, description = ?, image = ? WHERE id = ? AND userId = ?`, [title, description, image, recipeId, req.user._id], function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating recipe');
        } else if (this.changes === 0) {
            res.status(403).send('Unauthorized');
        } else {
            res.redirect(`/recipes/${recipeId}`);
        }
        db.close();
    });
};


exports.deleteRecipe = (req, res) => {
    const db = new sqlite3.Database('database.sqlite');
    const recipeId = req.params.id;
    const userId = req.user._id;

    db.run(`DELETE FROM recipes WHERE id = ? AND userId = ?`, [recipeId, userId], function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting recipe');
        } else if (this.changes === 0) {
            res.status(403).send('Unauthorized');
        } else {
            res.redirect('/');
        }
        db.close();
    });
};