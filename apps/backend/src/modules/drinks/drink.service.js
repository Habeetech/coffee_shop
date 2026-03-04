import AppError from "../../utils/AppError.js"
const initialDrinks = [
    {
        id: 1,
        name: "Flatwhite",
        url: "",
        price: 3.45,
        category: "hot-coffee"
    },
    {
        id: 2,
        name: "Latte",
        url: "",
        price: 3.99,
        category: "hot-coffee"
    },
    {
        id: 3,
        name: "Mocha",
        url: "",
        price: 4.65,
        category: "hot-coffee"
    },
    {
        id: 4,
        name: "Hot Chocolate",
        url: "",
        price: 4.65,
        category: "tea"
    },
    {
        id: 5,
        name: "Americano",
        url: "",
        price: 3.65,
        category: "hot-coffee"
    },
    {
        id: 6,
        name: "Iced Latte",
        url: "",
        price: 3.99,
        category: "iced-coffee"
    },
    {
        id: 7,
        name: "Mango Passion Fruit Cooler",
        url: "",
        price: 3.20,
        category: "smoothies"
    },
    {
        id: 8,
        name: "Peach Iced Tea",
        url: "",
        price: 3.99,
        category: "iced-tea"
    },
    {
        id: 9,
        name: "Salted Caramel Frappe",
        url: "",
        price: 4.95,
        category: "milkshake"
    },
    {
        id: 10,
        name: "Cappucino",
        url: "",
        price: 3.99,
        category: "hot-coffee"
    },
    {
        id: 11,
        name: "Cortado",
        url: "",
        price: 2.95,
        category: "hot-coffee"
    },
    {
        id: 12,
        name: "Iced Cappucino",
        url: "",
        price: 3.99,
        category: "iced-coffee"
    },
    {
        id: 13,
        name: "Iced Mocha",
        url: "",
        price: 4.65,
        category: "iced-coffee"
    }
];
let drinks = [];
export const resetDrinks = () => {
    drinks = initialDrinks.map(drink => ({...drink}));
}
resetDrinks()
const toId = (id) => parseInt(id, 10);
export const getDrinks = async () => {
    return drinks;
}
export const getADrink = async (id) => {
    id = toId(id)
  const requestedDrink = drinks.find(drink => drink.id === id)
  if (!requestedDrink) {
    throw new AppError(`No drink exist with Id - ${id}`, 404);
  }
  return requestedDrink;
}
export const addDrink = async (drinkToAdd) => {
    const id = drinks.length > 0 ? Math.max(...drinks.map(d => d.id)) + 1 : 1;
    drinkToAdd.id = id;
    drinks.push(drinkToAdd);
    return drinkToAdd;
}
export const updateDrink = async (id, drinkToUpdate) => {
     id = toId(id)
    const drink = drinks.find(d => d.id === id)
    if (!drink)
    {
        throw new AppError(`No drink exist with Id - ${id}`, 404);
    } else {
        Object.assign(drink, { ...drinkToUpdate, id })
    }
    
   return drink;
}
export const deleteDrink = async (id) => {
     id = toId(id)
    const index = drinks.findIndex(drink => drink.id === id)
    if (index === -1)
    {
        throw new AppError(`No drink exist with Id - ${id}`, 404);
    }
   const deletedDrink = drinks.splice(index, 1);
   return deletedDrink[0];
}