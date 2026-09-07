import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/productService.js";

//! Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price and category are required",
      });
    }

    const product = await createProductService({
      name,
      description,
      price,
      category,
      stock,
      
      image: req.uploadedImageUrl ?? null,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

//! Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
    });
  }
};

//! Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};

//! Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const updateData = {};
    if (name        !== undefined) updateData.name        = name;
    if (description !== undefined) updateData.description = description;
    if (price       !== undefined) updateData.price       = price;
    if (category    !== undefined) updateData.category    = category;
    if (stock       !== undefined) updateData.stock       = stock;

    
    if (req.uploadedImageUrl) {
      updateData.image = req.uploadedImageUrl;
    }

    const product = await updateProductService(req.params.id, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

//! Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await deleteProductService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Failed to delete product",
    });
  }
};
