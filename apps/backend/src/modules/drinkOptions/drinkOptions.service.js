import AppError from "../../utils/AppError.js";
import drinkOptions from "./drinkOptions.model.js";

const validateNoIncomingDuplicates = (items, groupName) => {
    const labels = items.map(i => i.label?.toLowerCase().trim());
    const hasDuplicates = new Set(labels).size !== labels.length;
    if (hasDuplicates) {
        throw new AppError(`Duplicate labels found in the request for group: ${groupName}`, 409);
    }
};

export async function addOptions(payload) {
    const doc = await drinkOptions.findOne();
    if (!doc) {
        for (const [key, items] of Object.entries(payload.options)) {
            validateNoIncomingDuplicates(items, key);
        }
        return await drinkOptions.create(payload);
    }

    for (const [key, items] of Object.entries(payload.options)) {
        if (doc.options.has(key)) {
            throw new AppError(`${key} already exists, please choose a different name`, 409);
        }

        validateNoIncomingDuplicates(items, key);
        doc.options.set(key, items);
    }

    await doc.save();
    return doc.options;
}

export async function updateOptions(payload) {
    const doc = await drinkOptions.findOne();
    if (!doc) throw new AppError("Options document cannot be found", 404);

    for (const [groupName, updates] of Object.entries(payload.options)) {
        if (!doc.options.has(groupName)) {
            throw new AppError(`Group ${groupName} does not exist`, 404);
        }

        const group = doc.options.get(groupName);
        validateNoIncomingDuplicates(updates, groupName);

        for (const update of updates) {
            const normalizedNewLabel = update.label.toLowerCase().trim();

            if (update._id) {
                const existing = group.id(update._id);
                if (!existing) throw new AppError(`Item with Id ${update._id} does not exist`, 404);

                const isDuplicate = group.some(item =>
                    item.label.toLowerCase().trim() === normalizedNewLabel &&
                    item._id.toString() !== update._id
                );
                if (isDuplicate) throw new AppError(`Label "${update.label}" already exists in ${groupName}`, 409);

                existing.label = update.label;
                existing.priceModifier = update.priceModifier;
            } else {
                const isDuplicate = group.some(item =>
                    item.label.toLowerCase().trim() === normalizedNewLabel
                );
                if (isDuplicate) throw new AppError(`Label "${update.label}" already exists in ${groupName}`, 409);

                group.push({
                    label: update.label,
                    priceModifier: update.priceModifier
                });
            }
        }
        doc.options.set(groupName, group);
    }
    await doc.save();
    return doc.options;
}

export async function getOptions() {
    return await drinkOptions.findOne();
}

export async function deleteOptions(groupName) {
    const doc = await drinkOptions.findOne();
    if (!doc) throw new AppError("Options document cannot be found", 404);

    if (!doc.options.has(groupName)) throw new AppError(`Group ${groupName} cannot be found`, 404);

    doc.options.delete(groupName); 
    await doc.save();
    return;
}

export async function deletegroupItem(groupName, itemId) {
    const doc = await drinkOptions.findOne();
    if (!doc) throw new AppError("Options document cannot be found", 404);

    if (!doc.options.has(groupName)) throw new AppError(`Group ${groupName} cannot be found`, 404);

    const group = doc.options.get(groupName); 
    const item = group.id(itemId);

    if (!item) throw new AppError(`Item with Id ${itemId} cannot be found`, 404); 

    group.pull(item);
    await doc.save();
    return;
}