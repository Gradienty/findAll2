const presets = require('../data/filterPresets.json');

async function getFiltersByCategory(categoryId) {
    const categoryName = {
        1: "Смартфоны",
        2: "Ноутбуки",
        3: "Пылесосы"
    }[categoryId];

    const preset = presets.find(p => p.category === categoryName);
    return preset ? preset.filters : {};
}

module.exports = { getFiltersByCategory };
