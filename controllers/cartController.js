const Items = require('../models/items.js');

const getCheckoutData = async (req, res) => {
    try {
        const { items } = req.body;

        // Fetch items with populated category and menu data
        const products = await Items.find({ _id: { $in: items.map(i => i.product) } })
            .populate({
                path: 'categoryId',
                populate: { path: 'menuId' }
            });


        // Group items by menu and category
        const groupedData = products.reduce((acc, product) => {
            const menu = product.categoryId.menuId;
            const category = product.categoryId;
            const cartItem = items.find(i => i.product === product._id.toString());

            if (!cartItem) return acc;

            // Create menu entry if not exists
            if (!acc[menu._id]) {
                acc[menu._id] = {
                    menu: {
                        _id: menu._id,
                        title: menu.title,
                        timeRange: menu.timeRange
                    },
                    categories: {}
                };
            }

            // Create category entry if not exists
            if (!acc[menu._id].categories[category._id]) {
                acc[menu._id].categories[category._id] = {
                    category: {
                        _id: category._id,
                        name: category.name,
                        description: category.description
                    },
                    items: []
                };
            }

            // Add item to category
            acc[menu._id].categories[category._id].items.push({
                _id: product._id,
                title: product.title,
                price: product.price,
                quantity: cartItem.quantity,
                comments: cartItem.comments,
                imageURL: product.imageURL
            });

            return acc;
        }, {});

        // Calculate totals
        const totals = products.reduce((acc, product) => {
            const cartItem = items.find(i => i.product === product._id.toString());
            if (cartItem) {
                acc.totalPrice += (product.discountPrice || product.price) * cartItem.quantity;
                acc.totalQuantity += cartItem.quantity;
            }
            return acc;
        }, { totalPrice: 0, totalQuantity: 0 });

        res.json({
            groupedData: Object.values(groupedData),
            ...totals
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getCheckoutData };