// web/src/__tests__/home.test.tsx
import { render, screen } from '@testing-library/react';
import HomeView from '@/src/components/HomeView';

describe('Home page', () => {
  it('shows brand text', () => {
    render(<HomeView />);
    expect(screen.getByText(/AiSoftLogic/i)).toBeInTheDocument();
  });
});