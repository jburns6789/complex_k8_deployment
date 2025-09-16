// Import the functions to be tested
const { fib } = require('./index');

// Mock the redis library
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    hset: jest.fn(),
    subscribe: jest.fn(),
    duplicate: jest.fn(() => ({
      on: jest.fn(),
      subscribe: jest.fn(),
    })),
  })),
}));

// We need to re-require the module *after* mocking redis
const { redisClient, sub } = require('./index');

// Test Suite 1: Test the pure Fibonacci function
describe('fib function', () => {
  test('should calculate correct Fibonacci value for low numbers', () => {
    expect(fib(0)).toBe(1);
    expect(fib(1)).toBe(1);
  });

  test('should calculate correct Fibonacci value for a medium number', () => {
    expect(fib(8)).toBe(34);
  });

  // Note: This recursive implementation is slow. Higher numbers will take a long time.
  // We'll keep the test value low for speed.
});

// Test Suite 2: Test the Redis interaction
describe('Redis Worker Logic', () => {
  // Test Case 1: Did the worker subscribe to the correct channel?
  test('should subscribe to the "insert" channel', () => {
    // Check if sub.subscribe was called with the correct argument
    expect(sub.subscribe).toHaveBeenCalledWith('insert');
  });

  // Test Case 2: Does the message handler work correctly?
  test('should calculate fib and call hset on new message', () => {
    // Find the 'message' event handler that was registered on the mock subscriber
    const messageCallback = sub.on.mock.calls.find(
      (call) => call[0] === 'message'
    )[1];

    // Simulate Redis sending a message with the index '10'
    messageCallback('insert', '10');

    // Assertion: Check if redisClient.hset was called with the correct parameters
    // The key should be 'values', the field should be '10', and the value should be fib(10) which is 89
    expect(redisClient.hset).toHaveBeenCalledWith('values', '10', 89);
  });
  
  // Test Case 3: Does it handle another value correctly?
  test('should handle a different index correctly', () => {
    const messageCallback = sub.on.mock.calls.find(
      (call) => call[0] === 'message'
    )[1];

    messageCallback('insert', '3');
    
    expect(redisClient.hset).toHaveBeenCalledWith('values', '3', 3);
  });
});
