
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DataTable } from '../components/DataTable';

type User = { id: number; name: string; email: string; age: number };

const data: User[] = [
  { id: 1, name: 'Mahima', email: 'mahima@example.com', age: 23 },
  { id: 2, name: 'Adiba', email: 'adiba@example.com', age: 25 },
  { id: 3, name: 'Arun', email: 'arun@example.com', age: 24 },
];

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable<User>,
};
export default meta;
type Story = StoryObj<typeof DataTable<User>>;

export const Default: Story = {
  args: {
    data,
    columns: [
      { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
      { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
      { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
    ],
    selectable: true,
  }
};

export const Loading: Story = {
  args: {
    data: [],
    columns: [
      { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
      { key: 'email', title: 'Email', dataIndex: 'email' },
      { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
    ],
    loading: true,
  }
};

export const Empty: Story = {
  args: {
    data: [],
    columns: [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      { key: 'email', title: 'Email', dataIndex: 'email' },
      { key: 'age', title: 'Age', dataIndex: 'age' },
    ],
    emptyText: 'Nothing to show here',
  }
};
