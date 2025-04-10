import { h, hFragment, defineComponent } from "@fwork/runtime";

const Recipe = defineComponent({
  state() {
    return {
      recipe: null,
    };
  },

  render() {
    return hFragment([
      this.state.recipe
        ? hFragment([
            h("h1", {}, [this.state.recipe.strDrink]),
            h("p", {}, [this.state.recipe.strInstructions]),
            h("img", { src: this.state.recipe.strDrinkThumb }, []),
          ])
        : h("h1", {}, ["Random cocktail"]),
      h("button", { on: { click: this.fetchRecipe } }, [
        this.state.recipe ? "Get another cocktail" : "Get a cocktail",
      ]),
    ]);
  },
  fetchRecipe() {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then((response) => response.json())
      .then((data) =>
        this.updateState({ ...this.state, recipe: data.drinks[0] })
      );
  },
});

const recipeComponent = new Recipe();
recipeComponent.mount(document.querySelector("#root"));
