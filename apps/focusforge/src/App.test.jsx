import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

describe('FocusForge player workflow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('renders the complete navigation and purchases an available building', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /focusforge/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^forge$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^focus$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^research$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^chronicle$/i })).toBeInTheDocument();

    expect(screen.getByText('Owned 1 / 10')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /build farm/i }));
    expect(screen.getByText('Owned 2 / 10')).toBeInTheDocument();
  });

  it('starts a focus session and supports pause and resume', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/session intention/i), 'Draft the launch page');
    await user.click(screen.getByRole('button', { name: /begin 25 minute focus/i }));

    expect(screen.getByRole('heading', { name: /focus session/i })).toBeInTheDocument();
    expect(screen.getByText('Draft the launch page')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^pause$/i }));
    expect(screen.getByRole('button', { name: /^resume$/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^resume$/i }));
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  });
});
