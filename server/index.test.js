// Import the necessary libraries
const request = require('supertest');
const app = require('./index'); // Import your Express app

// Mock the external dependencies (Postgres and Redis)
// This is a crucial step for true unit testing, as it isolates
// your server logic from the actual database and cache.
jest.mock('pg', () => {
  const mPool = {
    on: jest.fn(),
    query: jest.fn().mockResolvedValue({ rows: [] }), // Mock query to return empty rows
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('redis', () => ({
  createClient: () => ({
    on: jest.fn(),
    hgetall: jest.fn((key, callback) => callback(null, {})), // Mock hgetall to return an empty object
    hset: jest.fn(),
    duplicate: () => ({
      publish: jest.fn(),
    }),
  }),
}));

// Describe a "test suite" for our Express server
describe('Express API Endpoints', () => {
  // Test Case 1: Check the root endpoint
  test('GET / should return a welcome message', async () => {
    const response = await request(app).get('/');
    
    // Assertions: Check if the response is what we expect
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hi');
  });

  // Test Case 2: Check a successful POST request
  test('POST /api/values with a valid index should succeed', async () => {
    const response = await request(app)
      .post('/api/values')
      .send({ index: '10' }); // Send a valid index in the request body
    
    // Assertions: Check for a successful status code and response body
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ working: true });
  });

  // Test Case 3: Check a POST request with an invalid index
  test('POST /api/values with an index greater than 40 should fail', async () => {
    const response = await request(app)
      .post('/api/values')
      .send({ index: '50' }); // Send an invalid index
      
    // Assertions: Check for the specific error status code and message
    expect(response.statusCode).toBe(422);
    expect(response.text).toBe('Index too high');
  });
});
