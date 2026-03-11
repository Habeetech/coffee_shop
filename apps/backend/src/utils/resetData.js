import mongoose from "mongoose";

export async function dropTestDatabase() {
  const { connection } = mongoose;
  if (connection.readyState !== 1) return; // not connected
  await connection.dropDatabase();
}

const resetData = async (model, items = []) => {
  try {
    await model.deleteMany({});
    if (items.length > 0) {
      await model.insertMany(items, {ordered: true});
    }
  } catch (error) {
    console.error("Failed to reset data:", error);
  }
};

export default resetData;