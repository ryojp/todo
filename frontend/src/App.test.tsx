import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NavBar', () => {
  render(<App />);
  const linkElement = screen.getByText(/Tasks/i);
  expect(linkElement).toBeInTheDocument();
});
