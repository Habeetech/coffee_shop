import mongoose from "mongoose";

export const CATEGORY_MAP = {
    drinks: ["hot-coffee", "iced-coffee", "tea", "iced-tea", "milkshake", "smoothies"],
    cakes: ["whole-cake", "loaf-cake", "shortbreads", "pastries"],
    sandwiches: ["vegan", "vegetarian", "non-vegetarian"]
};

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    type: {
        type: String,
        required: true,
        enum: ["drinks", "cakes", "sandwiches", "biscuits", "crisps"]
    },
    category: {
        type: String,
        required: function () {
            return Boolean(CATEGORY_MAP[this.type]);
        },
        validate: {
            validator: function (value) {
                if (!this.type || !value) return true;
                const allowed = CATEGORY_MAP[this.type];
                if (!allowed) return true;
                return allowed.includes(value);
            },
            message: props =>
                `${props.value} is not a valid category for type ${this.type}`
        }
    },
    url: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;