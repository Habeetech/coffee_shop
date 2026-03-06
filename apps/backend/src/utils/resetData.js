const resetData = async (items, model) => {
    try {
        await model.deleteMany({});
        await model.insertMany(items);
    } catch (error) {
        console.error("Failed to reset drinks collection:", error);
    }
}
export default resetData;