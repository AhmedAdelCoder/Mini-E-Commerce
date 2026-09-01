import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !description || price === undefined || !category) {
    return res.status(400).json({
        success: false,
        message: "Name, description, price and category are required",
    });
}

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        image,
        });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
    } catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Server error",
        });
    }
};