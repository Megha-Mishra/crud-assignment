import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student management heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /student management/i });
  expect(heading).toBeInTheDocument();
});
