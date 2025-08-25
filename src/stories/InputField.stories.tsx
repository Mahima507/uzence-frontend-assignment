
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { InputField, InputFieldProps } from '../components/InputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  argTypes: {
    variant: { control: 'radio', options: ['filled', 'outlined', 'ghost'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Playground: Story = {
  render: (args: InputFieldProps) => {
    const [value, setValue] = useState('');
    return <div className="max-w-md"><InputField {...args} value={value} onChange={(e)=>setValue(e.target.value)} /></div>
  },
  args: {
    label: 'Label',
    placeholder: 'Type here...',
    helperText: 'Helper text goes here.',
    variant: 'outlined',
    size: 'md',
    enableClear: true,
  }
};

export const Invalid: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    invalid: true,
    errorMessage: 'Please enter a valid email address',
    variant: 'outlined',
    size: 'md',
  }
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    placeholder: 'Loading...',
    loading: true,
    variant: 'filled',
  }
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    enablePasswordToggle: true,
    helperText: 'Click show/hide to toggle',
  }
};
