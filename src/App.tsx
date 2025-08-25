
import React, { useState } from 'react';
import { InputField } from './components/InputField';
import { DataTable } from './components/DataTable';

type User = { id: number; name: string; email: string; age: number };

const initial: User[] = [
  { id: 1, name: 'Mahima', email: 'mahima@example.com', age: 23 },
  { id: 2, name: 'Adiba', email: 'adiba@example.com', age: 25 },
  { id: 3, name: 'Arun', email: 'arun@example.com', age: 24 },
];

export default function App() {
  const [value, setValue] = useState('');
  const [rows, setRows] = useState<User[]>(initial);

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold">Uzence Front-End Assignment Demo</h1>
        <p className="text-sm text-gray-600">Reactive InputField and DataTable with TypeScript + Tailwind</p>
      </header>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-medium">InputField</h2>
          <InputField
            label="Your Name"
            placeholder="Enter your name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            helperText="Try the clear button and password toggle in stories."
            variant="outlined"
            size="md"
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            helperText="Password toggle enabled"
            variant="filled"
            size="md"
            type="password"
            enablePasswordToggle
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">DataTable</h2>
          <DataTable<User>
            data={rows}
            columns={[
              { key: 'name', title: 'Name', dataIndex: 'name', sortable: True },
              { key: 'email', title: 'Email', dataIndex: 'email', sortable: True },
              { key: 'age', title: 'Age', dataIndex: 'age', sortable: True }
            ]}
            selectable
            onRowSelect={(selected) => console.log('Selected', selected)}
          />
        </div>
      </section>
    </div>
  );
}
