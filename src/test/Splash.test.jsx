import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Splash from '../components/Splash.jsx';

vi.useFakeTimers();

test('calls onDone after timeout when shown', () => {
  const onDone = vi.fn();
  render(<Splash show={true} onDone={onDone} />);
  vi.advanceTimersByTime(1600);
  expect(onDone).toHaveBeenCalled();
});
