const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const RecipeController = require('./controllers/RecipeController');

// Fake user
app.use(function (req, res, next) {
    req.userId = 1
    next()
})

const sqlite3 = require('sqlite3')


// Init database to file
let db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to the database.')
})

db.qa = function query(sql, values) {
    return new Promise((resolve, reject) => {
        db.all(sql, values, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

db.q = function query(sql, values) {
    return new Promise((resolve, reject) => {
        db.get(sql, values, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}


// Check if the database is empty
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Recipes'", async (err, row) => {
    if (err) {
        return console.error(err.message)
    }

    // If the database is empty, create the tables
    if (row === undefined) {

        db.serialize(async () => {

            // Init tables here
            await db.q('CREATE TABLE IF NOT EXISTS `Recipes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(255) NOT NULL, `description` VARCHAR(255) NOT NULL, `image` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);')
            await db.q('CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);')
            await db.q('CREATE TABLE IF NOT EXISTS `UsersRecipes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `userId` INTEGER NOT NULL, `recipeId` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);')

            // Insert some data
            await db.q('INSERT INTO `Recipes` (`title`, `description`, `image`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)', ['Recipe 1', 'Description 1', 'https://picsum.photos/200/300', '2021-01-01 00:00:00', '2021-01-01 00:00:00'])
            await db.q('INSERT INTO `Recipes` (`title`, `description`, `image`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)', ['Recipe 2', 'Description 2', 'https://picsum.photos/200/300', '2021-01-01 00:00:00', '2021-01-01 00:00:00'])
            await db.q('INSERT INTO `Recipes` (`title`, `description`, `image`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)', ['Recipe 3', 'Description 3', 'https://picsum.photos/200/300', '2021-01-01 00:00:00', '2021-01-01 00:00:00'])

            await db.q('INSERT INTO `Users` (`name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)', ['User 1', 'em@ail.com', '1234', '2021-01-01 00:00:00', '2021-01-01 00:00:00'])
            await db.q('INSERT INTO `Users` (`name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)', ['User 2', 'ma@il.ee', '1234', '2021-01-01 00:00:00', '2021-01-01 00:00:00'])

            await db.q('INSERT INTO `UsersRecipes` (`userId`, `recipeId`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?)', [1, 1, '2021-01-01 00:00:00', '2021-01-01 00:00:00'])
            await db.q('INSERT INTO `UsersRecipes` (`userId`, `recipeId`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?)', [1, 2, '2021-01-01 00:00:00', '2021-01-01 00:00:00'])
            await db.q('INSERT INTO `UsersRecipes` (`userId`, `recipeId`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?)', [2, 3, '2021-01-01 00:00:00', '2021-01-01 00:00:00'])
        })
    }
})

app.use(function (req, res, next) {

    // Add db to req
    req.db = db

    next()
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Redirect to recipes
    res.redirect('/recipes')
})

app.get('/recipes', RecipeController.index);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})