
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { InputField } from '../InputField';

test('renders label and updates value', () => {
  const onChange = vi.fn();
  render(<InputField label="Name" placeholder="Enter" value="Mah" onChange={onChange} />);
  expect(screen.getByLabelText('Name')).toBeInTheDocument();
  const input = screen.getByPlaceholderText('Enter') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Mahima' } });
  expect(onChange).toHaveBeenCalled();
});

test('shows error message when invalid', () => {
  render(<InputField label="Email" invalid errorMessage="Invalid email" />);
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
});
