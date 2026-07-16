// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignIn } from './SignIn';
import { ServicesProvider } from '../../context/ServicesContext';
import { AuthProvider } from '../../context/AuthContext';
import { createMockServices } from '../../services';

function renderSignIn() {
  const services = createMockServices();
  render(
    <ServicesProvider services={services}>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    </ServicesProvider>,
  );
  return services;
}

beforeEach(() => window.localStorage.clear());

describe('SignIn', () => {
  it('renders the form and the demo credential hint', () => {
    renderSignIn();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText(/iakovos@fylos\.me/)).toBeInTheDocument();
  });

  it('shows a field error for an invalid email on submit', async () => {
    renderSignIn();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText(/valid email/i)).toBeInTheDocument());
  });

  it('fills the demo credentials when Use is clicked', () => {
    renderSignIn();
    fireEvent.click(screen.getByRole('button', { name: 'Use' }));
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('iakovos@fylos.me');
    expect((screen.getByLabelText('Password') as HTMLInputElement).value).toBe('fylos');
  });
});
