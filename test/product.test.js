const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../src/app');
const Product = require('../src/models/product');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Product API', () => {
  before(async function () {
    // Increase the timeout for the "before all" hook if needed
    this.timeout(15000);

    // Your setup code here (if any)
    // For example, clearing the database before tests
    await Product.deleteMany({});

    // Insert some test data
    await Product.create({
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 20.0,
      variants: [
        { name: 'Variant 1', sku: 'V1', additionalCost: 5, stockCount: 10 },
      ],
    });

    await Product.create({
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 25.0,
      variants: [
        { name: 'Variant 2', sku: 'V2', additionalCost: 8, stockCount: 15 },
      ],
    });
  });

  after(() => {
    // Close the server after all tests are done
    server.close();
  });

  it('should create a new product with variants', async () => {
    const res = await chai
      .request(app)
      .post('/api/products')
      .send({
        name: 'New Test Product',
        description: 'New Test Description',
        price: 30.0,
        variants: [
          { name: 'New Variant 1', sku: 'NV1', additionalCost: 4, stockCount: 12 },
          { name: 'New Variant 2', sku: 'NV2', additionalCost: 6, stockCount: 18 },
        ],
      });

    expect(res).to.have.status(201);
    expect(res.body).to.be.an('object');
    expect(res.body.name).to.equal('New Test Product');
    expect(res.body.variants).to.have.lengthOf(2);
  });

  it('should get all products', async () => {
    const res = await chai.request(app).get('/api/products');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(3);
  });

  it('should update a product and its variants', async () => {
    // Retrieve the product ID for updating
    const product = await Product.findOne({ name: 'Test Product 1' });
    const productId = product._id;
  
    const updateRes = await chai
      .request(app)
      .put(`/api/products/${productId}`)
      .send({
        variants: [
          { name: 'Updated Variant 1', sku: 'UV1', additionalCost: 3, stockCount: 8 },
          { name: 'New Variant 2', sku: 'NV2', additionalCost: 6, stockCount: 12 },
        ],
      });
  
    expect(updateRes).to.have.status(200);
    expect(updateRes.body).to.be.an('object');
    expect(updateRes.body.message).to.equal('Product and variants updated successfully');
  
    // Check if the product and variants were updated correctly
    const updatedProduct = await Product.findById(productId);
    expect(updatedProduct.variants).to.have.lengthOf(2);
    expect(updatedProduct.variants[0].name).to.equal('Updated Variant 1');
    expect(updatedProduct.variants[1].name).to.equal('New Variant 2');
  });
  

  it('should delete a product and its variants', async () => {
    // Retrieve the product ID for deletion
    const product = await Product.findOne({ name: 'Test Product 1' });
    const productId = product._id;

    const deleteRes = await chai.request(app).delete(`/api/products/${productId}`);

    expect(deleteRes).to.have.status(200);
    expect(deleteRes.body).to.be.an('object');
    expect(deleteRes.body.message).to.equal('Product and variants deleted successfully');

    // Check if the product and variants were deleted
    const deletedProduct = await Product.findById(productId);
    expect(deletedProduct).to.be.null;
  });

  it('should search for products by name, description, or variant name', async () => {
    const res = await chai.request(app).get('/api/products?search=Test');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
  });
});
