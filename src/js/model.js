import {async} from 'regenerator-runtime';
import {API_URL} from './config.js';

export const state =
{
    recipe: {},
};

export const loadRecipe = async function(id)
{
    try
    {
        const response = await fetch(`${API_URL}/${id}`);

        const data = await response.json();

        if(!response.ok)
            throw new Error(`${data.message} (${response.status})`)


        const {recipe} = data.data;
        state.recipe = 
        {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };
        console.log(state.recipe);
    }
    catch(error)
    {
        alert(error.message);
    }
};