const express = require('express');
const RecipeController = require('./controllers/RecipeController');
const path = require('path');

const app = express();
const port = 3000;

// Set up middleware
app.use(express.urlencoded({ extended: true }));


// Set the view engine to Pug
app.set('view engine', 'pug');

// Set up routes
app.get('/recipes', RecipeController.getRecipes);
app.get('/recipes/:id', RecipeController.detail);
app.get('/recipes/create', RecipeController.createRecipe);
app.post('/recipes/create', RecipeController.createRecipe);
app.get('/recipes/:id/edit', RecipeController.editRecipe);
app.post('/recipes/:id/edit', RecipeController.editRecipe);
app.post('/recipes/:id/delete', RecipeController.deleteRecipe);

app.get('/', (req, res) => {
    res.render('home');
});


app.get('/', function(req, res) {
    Recipe.find({}, function(err, recipes) {
        if (err) {
            console.log(err);
        } else {
            res.render('home', { recipes: recipes });
        }
    });
});


// Set up a catch-all middleware for 404 errors
app.use((req, res, next) => {
    res.status(404).send('404 Error: Page not found');
});

// Set up a middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 Error: Internal Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});