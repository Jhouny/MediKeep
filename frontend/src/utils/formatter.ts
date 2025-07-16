// ====================== Formatters ====================== //
export const formatFunction = (value: string, format?: string): any => {
    switch (format) {
        case 'cpf':
            return value.replace(/^(\d{3})(\d)/, '$1.$2')
                    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
                    .slice(0, 14);
        case 'phone':
            return value.replace(/\D/g, '')
                    .replace(/^(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2')
                    .slice(0, 15);
        case 'date':
            return new Date(value).toLocaleDateString('pt-BR'); // Format as DD/MM/YYYY
        default:
            return value; // No formatting applied
    }
}