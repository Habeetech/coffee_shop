const optionsSeed = [{
    options: {
        size: [{ label: "Small", priceModifier: 0 }, { label: "Medium", priceModifier: 0.5 }, { label: "Large", priceModifier: 1 }],
        milk: [{ label: "Whole", priceModifier: 0 }, { label: "Semi", priceModifier: 0 }, { label: "Skimmed", priceModifier: 0 },
        { label: "Oat", priceModifier: 0.45 }, { label: "Soya", priceModifier: 0 }, { label: "Coconut", priceModifier: 0.65 }, { label: "Almond", priceModifier: 0.75 }],
        syrup: [{ label: "Caramel", priceModifier: 0.65 }, { label: "Vanilla", priceModifier: 0.65 }, { label: "SF Gingerbread", priceModifier: 0.65 },
        { label: "SF caramel", priceModifier: 0.65 }, { label: "SF Vanilla", priceModifier: 0.65 }, { label: "Cinnamon Bun", priceModifier: 0.65 }
        ],
        extras: [{ label: "Whipped Cream", priceModifier: 0.65 }, { label: "Light Whip", priceModifier: 0.65 }, { label: "Marshmallow", priceModifier: 0.65 },
        { label: "Cinnamon Stick", priceModifier: 0.25 }, { label: "Pouring Cream", priceModifier: 0.25 }, { label: "Chocolate Dusting", priceModifier: 0 }
        ]
    }
}]
export default optionsSeed;