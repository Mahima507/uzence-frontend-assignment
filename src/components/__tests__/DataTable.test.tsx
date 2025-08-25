
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { DataTable } from '../DataTable';

type U = { id: number; name: string; age: number };

const data: U[] = [
  { id: 1, name: 'B', age: 30 },
  { id: 2, name: 'A', age: 20 },
];

test('sorts by column when header clicked', () => {
  render(<DataTable<U>
    data={data}
    columns={[
      { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
      { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
    ]}
  />);
  const nameHeader = screen.getByText('Name');
  fireEvent.click(nameHeader); // asc
  const rows = screen.getAllByRole('row');
  // first data row after header should be A
  const firstRowCells = within(rows[1]).getAllByRole('cell');
  expect(firstRowCells[0]).toHaveTextContent('A');
});

test('selects rows', () => {
  const onRowSelect = vi.fn();
  render(<DataTable<U>
    data={data}
    selectable
    columns={[
      { key: 'name', title: 'Name', dataIndex: 'name' },
      { key: 'age', title: 'Age', dataIndex: 'age' },
    ]}
    onRowSelect={onRowSelect}
  />);
  const checkboxes = screen.getAllByRole('checkbox');
  // first checkbox is "select all", second selects first row
  fireEvent.click(checkboxes[1]);
  expect(onRowSelect).toHaveBeenCalledWith([data[0]]);
});
