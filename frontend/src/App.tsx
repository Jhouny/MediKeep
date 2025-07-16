import { EntityTable } from './components/EntityTable';
import { MantineProvider, Tabs } from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './App.css'
import { theme } from './theme.ts'
import { 
  addRecord,
  getRecords,
  addUser,
  getUsers,
  addRecordType,
  getRecordTypes
} from './services/api';
import { IconUser, IconFileIsr, IconBinaryTree } from '@tabler/icons-react';
import type { User, Record, RecordType } from './utils/types.ts';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <div className="App">
        <Tabs defaultValue="records" variant='outline'>
          <Tabs.List>
            <Tabs.Tab value="records" leftSection={<IconFileIsr size={16} />}>Records</Tabs.Tab>
            <Tabs.Tab value="users" leftSection={<IconUser size={16} />}>Users</Tabs.Tab>
            <Tabs.Tab value="record-types" leftSection={<IconBinaryTree size={16} />}>Record Types</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="users">
            {/* Entity table for user management */}
            <EntityTable<User>
              title="Users"
              fetchData={getUsers}
              postData={addUser}
              formFields={[
                { name: 'id',        label: 'CPF',                type: 'text', format: 'cpf', 
                  validate: (value) => {
                    let error = '';
                    if (!value) {
                      error = 'CPF is required';
                    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
                      error = 'Invalid CPF format. Use XXX.XXX.XXX-XX';
                    } else if (value.length !== 14 || Number(value.replace(/\D/g, '')) <= 0) {
                      error = 'Invalid CPF';
                    }
                    return { valid: error === '', error };
                  }
                },
                { name: 'firstName', label: 'Nome',               type: 'text' },
                { name: 'lastName',  label: 'Sobrenome',          type: 'text' },
                { name: 'birthDate', label: 'Data de Nascimento', type: 'date' }
              ]}
            />
          </Tabs.Panel>
          <Tabs.Panel value="record-types">
            {/* Entity table for record types management */}
            <EntityTable<RecordType>
              title="Record Types"
              fetchData={getRecordTypes}
              postData={addRecordType}
              headers={['ID', 'name', 'description']}
              formFields={[
                { name: 'name',        label: 'Nome',      type: 'text' },
                { name: 'description', label: 'Descrição', type: 'text' },
              ]}
            />
          </Tabs.Panel>
          <Tabs.Panel value="records">
            {/* Entity table for records management */}
            <EntityTable<Record>
              title="Records"
              fetchData={getRecords}
              postData={addRecord}
              formFields={[
                { name: 'typeID',      label: 'Tipo',      type: 'select',
                  getOptions: async () => {
                    const response = await getRecordTypes();
                    return response.data.map((type: RecordType) => ({ value: String(type.ID), label: type.name }));
                  }
                },
                { name: 'patientID',   label: 'Paciente',  type: 'select',
                  getOptions: async () => {
                    const response = await getUsers();
                    return response.data.map((user: User) => ({ value: String(user.ID), label: `${user.firstName} ${user.lastName}` }));
                  }
                },
                { name: 'date',        label: 'Data',      type: 'date' },
                { name: 'file',        label: 'Documento', type: 'file',
                  validate: (value) => {
                    if (!value) {
                      return { valid: false, error: 'File is required' };
                    }
                    return { valid: true, error: '' };
                  }
                },
                { name: 'doctor_name', label: 'Médico',    type: 'text', required: false },
                { name: 'notes',       label: 'Notas',     type: 'text', required: false }
              ]}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
    </MantineProvider>
  )
}