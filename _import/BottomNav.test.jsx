import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';

test('renders five nav tabs', () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>);
  const labels = ['Home','You','Finance','Health','Profile'];
  for (const label of labels) {
    expect(screen.getByText(label)).toBeInTheDocument();
  }
});
