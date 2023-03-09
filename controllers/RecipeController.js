const RecipeModel = require("../models/RecipeModel");

async function index(req, res) {
    res.render('recipes/index', {recipes: await RecipeModel.getAll({}, req.db)})
}

module.exports = {
    index
}