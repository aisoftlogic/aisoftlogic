// web/src/__tests__/smoke.test.tsx
import { render, screen } from '@testing-library/react';
import HomeView from '@/src/components/HomeView';

describe('smoke:web', () => {
  it('smoke: renders without crash', () => {
    render(<HomeView />);
    expect(screen.getByText(/AiSoftLogic/i)).toBeInTheDocument();
  });
});