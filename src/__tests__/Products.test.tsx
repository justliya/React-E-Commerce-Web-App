
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Products from '../pages/Products';
import { store } from '../redux/store';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Products Component', () => {
  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Products />
        </QueryClientProvider>
      </Provider>
    );

  test('fetches and displays products', async () => {
    const mockProducts = {
      data: [
        {
          id: 1,
          title: 'Test Product',
          price: 29.99,
          description: 'Test description for product.',
          category: 'electronics',
          rating: { rate: 4.2 },
          image: 'test-image.jpg',
          quantity: 1,
        },
      ],
    };

    mockedAxios.get.mockResolvedValue(mockProducts);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('matches the snapshot', () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });
});