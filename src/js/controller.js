import * as model from './model.js'
import recipeView from './views/recipeView.js'

// polyfilling async/await
import 'regenerator-runtime/runtime'
// polyfilling everything else
import 'core-js/stable';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s)
{
  return new Promise(function (_, reject)
  {
    setTimeout(function ()
    {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function()
{
  try
  {
    const id = window.location.hash.slice(1);
    if(!id)
      return ;
    console.log(id);
    recipeView.renderSpinner();

    // 1. Loading recipe
    await model.loadRecipe(id);
    
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  }
  catch(error)
  {
    alert(error);
  }
  
};

// controlRecipes();
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);