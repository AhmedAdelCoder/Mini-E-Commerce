import Product from "../models/Product.js";

export const createProductService = async (productData) => {
  return await Product.create(productData);
};

export const getProductsService = async () => {
  return await Product.find();
};

export const getProductByIdService = async (id) => {
  return await Product.findById(id);
};

export const updateProductService = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
      context: 'query', 
    }
  );

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};


export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};