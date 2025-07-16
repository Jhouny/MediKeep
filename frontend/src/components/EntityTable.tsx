import { useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import { DataTable } from './DataTable';
import { IconPlus, IconRefresh, IconCheck, IconUpload } from '@tabler/icons-react';
import { IconButton } from './IconButton';
import { Button, Modal, TextInput, PasswordInput, NumberInput, Select, FileInput, FileButton } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { formatFunction } from '../utils/formatter';

type FormField = {
    name: string;
    label: string;
    type: string;
    // Optional properties for more complex inputs
    options?: { value: string; label?: string }[]; // Static options for dropdowns (label is optional, defaults to value)
    getOptions?: () => Promise<{ value: string; label: string }[]>; // Retrieve elements for selection (e.g. dropdown inputs) --> Beware that options will override getOptions if both are provided

    placeholder?: string; // Placeholder for inputs
    disabled?: boolean;
    required?: boolean;
    
    min?: number; // Minimum value for number inputs
    max?: number; // Maximum value for number inputs
    
    format?: string; // Format choice for displaying values
    validate?: (value: any) => {valid: boolean, error?: string}; // Validation function for the input
}

const defaultFormField: Partial<FormField> = {
    required: true,
    disabled: false,
    validate: (value) => { return { valid: value !== undefined && value !== null && value !== '', error: 'Invalid value' }; },
};

type EntityTableProps<T> = {
    title: string;
    fetchData: () => Promise<AxiosResponse<T[]>>;
    postData?: (data: T) => Promise<AxiosResponse<T>>;
    formFields?: FormField[]; // Optional form fields for adding new data
    headers?: string[];  // Optional list of headers to use for the table (must be in order of data keys)
};

export function EntityTable<T extends Record<string, any> | undefined>({title, fetchData, postData, formFields, headers}: EntityTableProps<T>) {
    const [refreshing, setRefreshing] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    // Create empty input values object for the form inputs
    // This will have one key-value pair for each passed input field
    const defaultFormValues: Record<string, any> = {};
    formFields?.forEach(field => { defaultFormValues[field.name] = ''; });

    const [inputValues, setInputValues] = useState(defaultFormValues);

    // Function to handle input changes
    const handleInputChange = (field: string, formatter?: (value: string) => string) => {
    return (e: any) => {
        let rawValue;
        if (typeof e === 'object' && e !== null && e.hasOwnProperty('target')) {
            rawValue = e.target.value; // For TextInput, PasswordInput, etc.
        } else {
            rawValue = e; // For Select, DateInput, etc.
        }
        setInputValues((prev) => ({
            ...prev,
            [field]: formatter ? formatter(rawValue) : rawValue,
        }));

        const sanitizedValue = formatter ? formatter(rawValue) : rawValue;

        form.setFieldValue(field, sanitizedValue); // Update Mantine form state
    };
  };

    // Function to handle the submission of new data
    const handleSubmit = () => {
        // Logic for submitting new data goes here
        if (postData) {
            // Validate input values
            const errors = formFields?.map(field => {
                if (field.validate) {
                    const isValid = field.validate(inputValues[field.name]);
                    return isValid.valid === true ? null : { field: field.name, error: isValid.error };
                }
                return null;
            }).filter(error => error !== null);

            if (errors && errors.length > 0) {
                // Set form errors if any validation fails
                errors.forEach(error => {
                    if (error) {
                        form.setFieldError(error.field, error.error);
                    }
                });
                return; // Stop submission if there are validation errors
            }

            // Sanitize input values if needed
            const sanitizedValues = { ...form.values };
            formFields?.forEach(field => {
                if (field.format === 'cpf' && sanitizedValues[field.name]) {
                    sanitizedValues[field.name] = sanitizedValues[field.name].replace(/[.-]/g, '');
                } else if (field.format === 'phone' && sanitizedValues[field.name]) {
                    sanitizedValues[field.name] = sanitizedValues[field.name].replace(/[() -]/g, '');
                }
            });

            // If all validations pass, proceed with submission
            const newData = sanitizedValues as T;
            console.log('Submitting new data:', newData);
            postData(newData)
                .then(response => {
                    console.log('Data submitted successfully:', response.data);
                    close();  // Close the modal after submission
                })
                .catch(error => {
                    console.error('Error submitting data:', error);
                });
            
            // Reset form after submission
            form.reset();
            // Wait a bit and Update table data
            setTimeout(() => {
                setRefreshing(!refreshing);
            }, 500);
        }
    };

    const form = useForm({
        mode: 'controlled',
        initialValues: {} as T, // Initialize with empty object or default values
    });

    // Initialize form fields with default values if provided
    const normalizedFormFields = formFields?.map(field => ({
        ...defaultFormField,
        ...field,
    }));

    const [dropdownOptions, setDropdownOptions] = useState<{ [fieldName: string]: { value: string; label: string }[] }>({});

    useEffect(() => {
        // Fetch options for each field that has getOptions defined
        normalizedFormFields?.forEach(field => {
            if (field.type === 'select') {
                if (field.getOptions) {
                    field.getOptions().then(response => {
                        setDropdownOptions(prev => ({
                            ...prev,
                            [field.name]: response,
                        }));
                    }).catch(error => {
                        console.error(`Error fetching options for ${field.name}:`, error);
                    });
                } else {
                    setDropdownOptions(prev => ({
                        ...prev,
                        [field.name]: field.options ? field.options.map(opt => ({
                            value: opt.value,
                            label: opt.label ?? opt.value,
                        })) : [],
                    }));
                }
            }
        });
    }, [normalizedFormFields]);

    const formInputs = normalizedFormFields?.map(field => {
        const commonProps = {
            ...form.getInputProps(field.name),
            label: field.label,
            placeholder: field.placeholder ?? `Enter ${field.label}`,
            required: field.required,
            disabled: field.disabled,
            value: inputValues[field.name] ?? '',
            onChange: handleInputChange(field.name, field.format ? (value: string) => formatFunction(value, field.format) : undefined),
        };

        switch (field.type) {
            case 'date':
               // Handle date input specifically if needed
                return <DateInput key={field.name} {...commonProps}/>;
            case 'text':
                return <TextInput key={field.name} {...commonProps}/>;
            case 'email':
                return <TextInput key={field.name} {...commonProps}/>;
            case 'password':
                return <PasswordInput key={field.name} {...commonProps}/>;
            case 'number':
                return <NumberInput key={field.name} {...commonProps} min={field.min} max={field.max}/>;
            case 'select':
                return (
                    <Select
                        key={field.name}
                        {...commonProps}
                        data={dropdownOptions[field.name] || []}
                        searchable
                        clearable
                    />
                );
            case 'file':
                return (
                    <FileInput
                        key={field.name}
                        {...commonProps}
                        placeholder={field.placeholder ?? `Upload ${field.label}`}
                        leftSection={<IconUpload size={20} />}
                        leftSectionPointerEvents='none'
                        accept="application/pdf,image/*"
                        // clearable
                    />
                );
        }
    });

    
    return (
        <>
            <div className='entity-table-header'>
                <h1>{title}</h1>
                <div className='entity-table-actions'>
                    {/* Button to add new data */}
                    <IconButton
                        icon={IconPlus}
                        onClick={() => open()} 
                    >
                        Novo
                    </IconButton>
                    {/* Button to refresh data with rotating icon */}
                    <IconButton
                        icon={IconRefresh}
                        iconclass="rotate-icon"
                        onClick={() => setRefreshing(!refreshing)}
                    >
                        Atualizar
                    </IconButton>
                </div>
            </div>
            {/* Modal for adding new data */}
            <Modal
                opened={opened}
                onClose={close}
                title={`Add New ${title}`}

            >
                {/* Content for adding new data goes here */}
                <form onSubmit={form.onSubmit(() => handleSubmit())}>
                    {/* Form fields for new data */}
                    {formInputs}
                    
                    {/* Submit button */}
                    <Button 
                        type='submit'
                        variant='filled'
                        style={{
                            width: '30%',
                            left: '70%',
                            marginTop: '1rem',
                        }}
                        radius={'md'}
                    >
                        Submit
                        <IconCheck style={{ marginLeft: '0.5rem' }} />
                    </Button>
                </form>
            </Modal>
            {/* Pass the fetchData function and headers to DataTable */}
            <DataTable
                fetchData={fetchData}
                headers={headers}
                refreshkey={refreshing} 
            />
        </>
    );
}
