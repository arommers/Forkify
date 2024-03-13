import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'

// polyfilling async/await
import 'regenerator-runtime/runtime'
// polyfilling everything else
import 'core-js/stable';

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
    console.log(error);
    recipeView.renderError();
  }
  
};

const controlSearchResults = async function()
{
  try
  {
    const query = searchView.getQuery();
    if(!query)
      return;
    
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
  }
  catch(error)
  {
    console.log(error);
  }
}

const init = function()
{
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}

init();
