const Product = require('../models/product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, variants } = req.body;

    // Create the product with variants
    const product = await Product.create({
      name,
      description,
      price,
      variants: variants.map(variant => ({ ...variant })), // Set productId to null for now
    });

    // Update the product with its productId in variants
    await Product.findByIdAndUpdate(
      product._id,
      { $set: { 'variants.$[elem].productId': product._id } },
      { arrayFilters: [{ 'elem._id': { $in: product.variants.map(v => v._id) } }], new: true }
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Extract product ID from the URL parameters
    const variants = req.body.variants;

    // Retrieve the existing product
    const existingProduct = await Product.findById(productId);

    // Check if the product exists
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove existing variants and add new variants
    const updatedVariants = variants.map((variant) => ({
      ...variant,
      productId,
    }));

    // Update the product with the new variants
    await Product.findByIdAndUpdate(
      productId,
      { $set: { variants: updatedVariants } },
      { new: true }
    );

    res.status(200).json({ message: 'Product and variants updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  exports.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;

      await Product.deleteOne({ _id: productId });
  
      res.status(200).json({ message: 'Product and variants deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    console.log('Search:', search);

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'variants.name': { $regex: search, $options: 'i' } },
        ],
      };
    }
    
    console.log('Query:', query);

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};