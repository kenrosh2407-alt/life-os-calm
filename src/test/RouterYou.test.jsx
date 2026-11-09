import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { vi } from 'vitest';
import AppShell from '../AppShell.jsx';

test('router renders Home title on /', async () => {
  // AppShell shows the login screen unless a session is stored, so start signed in.
  const user = { name: 'Test User', phone: '+15555550100' };
  localStorage.setItem('lifeos_token', 'test-token');
  localStorage.setItem('lifeos_user', JSON.stringify(user));
  sessionStorage.setItem('splash:seen', new Date().toDateString());
  vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => ({ success: true, user }) })));

  const router = createMemoryRouter([{ path: '/*', element: <AppShell /> }], { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  // The title appears in the header link and on the Home page.
  expect((await screen.findAllByText('Life‑OS')).length).toBeGreaterThan(0);

  vi.unstubAllGlobals();
  localStorage.clear();
  sessionStorage.clear();
});
