import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppShell from '../AppShell.jsx';

test('router renders Home title on /', () => {
  const router = createMemoryRouter([{ path: '/', element: <AppShell /> }], { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);
  expect(screen.getByText('Life‑OS')).toBeInTheDocument();
});
