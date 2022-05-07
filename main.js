const app = require('express')();

app.get("/menus", (req,res) => {
    let userId = req.query.userId;
    let displayMenus = [];
    let menuSet = new Set();
    const ingredients = require('./ingredients.json')[userId];
    for(let ingredient of ingredients){
        let menus = require('./menus.json');
        menus = menus.filter(m => m.ingredients.filter(i => i.name === ingredient.name).length > 0);
        menuSet.add(...menus);
    }
    for(let menu of menuSet){
        let missingIngredients = [];
        for(let ingredient of menu.ingredients){
            let foundIngredient = ingredients.filter(i => i.name === ingredient.name)
            if(foundIngredient.length === 0 || foundIngredient[0].amount < ingredient.amount){
                missingIngredients.push(ingredient);
            }
        }
        if(missingIngredients.length === 0){
            displayMenus.push({menu, cookable: true});
        }
        else {
            displayMenus.push({menu, cookable: false, missingIngredients});
        }
    }
    res.json(displayMenus);
})
app.listen(3000, () => {
    console.log('Server running on port 3000');
})