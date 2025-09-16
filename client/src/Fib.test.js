import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Fib from './Fib';

jest.mock('axios');

describe('Fib Component', () => {
  beforeEach(() => {
    // Reset mocks and provide default implementations for GET requests
    axios.get.mockImplementation((url) => {
      if (url === '/api/values/current') {
        return Promise.resolve({ data: {} });
      }
      if (url === '/api/values/all') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('not found'));
    });
    axios.post.mockResolvedValue({ data: {} });
  });

  // Test 1: Renders and handles initial data fetch
  test('should render the form and fetch initial data', async () => {
    render(<Fib />);
    
    // Assertion: Wait for the component to finish its initial render and data fetch
    // before checking for elements. This resolves the `act` warnings.
    await waitFor(() => {
      expect(screen.getByLabelText(/enter your index/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText('Indexes I have seen:')).toBeInTheDocument();
  });

  // Test 2: Form submission
  test('should call the post API on submit and clear the input', async () => {
    render(<Fib />);

    const input = screen.getByLabelText(/enter your index/i);
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/values', { index: '10' });
      expect(input.value).toBe('');
    });
  });

  // Test 3: Renders data correctly (this test remains the same)
  test('should correctly render multiple calculated values from state', async () => {
    axios.get.mockResolvedValueOnce({
      data: { '5': '8', '8': '21' }
    });

    render(<Fib />);

    expect(await screen.findByText('For index 5 I calculated 8')).toBeInTheDocument();
    expect(await screen.findByText('For index 8 I calculated 21')).toBeInTheDocument();
  });
});
