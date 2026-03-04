import drinks from "../seeders/drinkSeed.js"
import Drink from "../modules/drinks/drink.model.js"

const resetDrinks = async () => {
    try {
        await Drink.deleteMany({});
        await Drink.insertMany(drinks);
    } catch (error) {
        console.error("Failed to reset drinks collection:", error);
    }
}
export default resetDrinks;