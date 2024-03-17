import * as model from './model.js'
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'

// polyfilling async/await
import 'regenerator-runtime/runtime'

// polyfilling everything else
import 'core-js/stable';

// if (module.hot)
// {
//   module.hot.accept()
// }

const controlRecipes = async function()
{
  try
  {
    const id = window.location.hash.slice(1);
    if(!id)
      return ;
    recipeView.renderSpinner();

    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // 1. update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading recipe
    await model.loadRecipe(id);
    
    // 3. Rendering recipe
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
    resultsView.renderSpinner();
    
    // 1. get search query
    const query = searchView.getQuery();
    if(!query)
      return;
    
    // 2. load results 
    await model.loadSearchResults(query);

    // 3. render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // 4. render initial pagination button
    paginationView.render(model.state.search)
  }
  catch(error)
  {
    console.log(error);
  }
}

const controlPagination = function(goToPage)
{
  // render  new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new paginations button
  paginationView.render(model.state.search)
}

const controlServings = function(newServings)
{
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function()
{
 
  // 1. add or remove bookmarks
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);

  // 2. update recipe view
  recipeView.update(model.state.recipe);

  // 3. render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function()
{
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe)
{
  try
  {
    //Show loading Spinner
    addRecipeView.renderSpinner();    

    // upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // set succes message
    addRecipeView.renderMessage();

    // render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //change idea in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function()
    {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);
  }
  catch(error)
  {
    console.log('❤', error);
    addRecipeView.renderError(error.message);
  }
  //upload the new recipe data
}

const init = function()
{
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandleClick(controlPagination);
  addRecipeView.addhandlerUpload(controlAddRecipe);
}

init();
