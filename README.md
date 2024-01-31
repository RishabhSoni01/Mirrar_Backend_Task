# Product API

## Install Dependencies

```bash
cd e-commerce-api
npm install
```
## Running the API

1. Set up your environment variables:

   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://your-username:your-password@localhost:27017/your-database

   Replace `your-username`, `your-password`, and `your-database` with your actual MongoDB credentials and database information.

2. Run the API:

npm start

The API will be running at http://localhost:3000.

## API Endpoints

- **POST /api/products**
  - Create a new product with variants.
  - Request Body:

```json
  {
      "name": "New Test Product",
      "description": "New Test Description",
      "price": "30.0",
      "variants": [
        {
            "name": "New Variant 1",
            "sku": "NV1",
            "additionalCost": 4,
            "stockCount": 12
        },
        {
            "name": "New Variant 2",
            "sku": "NV2",
            "additionalCost": 6,
            "stockCount": 18
        }
      ]
  }
```

- **GET /api/products**
  - Retrieve all products or search for products.
  - Query Parameters:
search: Search term for product name, description.

- **PUT /api/products/:id**
    - Update a product and its variants.
Request Body:
```json
{
  "variants": [
    {
      "name": "Updated Variant 1",
      "sku": "UV1",
      "additionalCost": 3,
      "stockCount": 8
    },
    {
      "name": "New Variant 2",
      "sku": "NV2",
      "additionalCost": 6,
      "stockCount": 12
    }
  ]
}
```

- **DELETE /api/products/:id**
  - Delete a product and its variants.
 
- **Search Functionality**
  - You can search for products by providing a search query parameter in the GET request to /api/products. The API will return products that match the search term in their name, description, or variant name.
  
  - Example:
    ```bash
     http://localhost:3000/api/products?search=Product_Name
    ```
## Testing

To run tests, execute the following command:
```bash
npm test
```

## Architectural Decisions

- The project uses the Node.js runtime with Express for the web framework.
- MongoDB is chosen as the database for its flexibility and scalability.
- Mongoose is used as an ODM (Object Document Mapper) for MongoDB.

## Assumptions
- Variants are optional, and a product can have zero or more variants.
- The API assumes a single database for simplicity.

## Postman Collection

```bash
https://api.postman.com/collections/19381541-90b7f617-4bc6-44d7-9be3-29679a357b97?access_key=PMAT-01HNFEF3ZVRS6G63QSS5P87X3E
```

 Copy the JSON:
  - Copy the JSON content of the Postman collection.

 Open Postman:
  - Open the Postman app.

 Click on Import:
  - In the Postman app, click on the "Import" button, usually located in the top-left corner.

 Select Import File:
  - Choose the "Raw Text" option or "Paste Raw Text" and paste the copied JSON into the provided field.

 Click on Import:
  - Click the "Import" button.

 View Imported Collection:
  - Once imported, you should see the new collection in the left sidebar of Postman.

