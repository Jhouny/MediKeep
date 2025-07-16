import axios from 'axios';
import type { AxiosResponse } from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
import type { User, Record, RecordType } from '../utils/types';

// =========== API functions ========== //

export const getRecords: () => Promise<AxiosResponse<Record[]>> = () => api.get('/records');
export const getUsers: () => Promise<AxiosResponse<User[]>> = () => api.get('/users');
export const getRecordTypes: () => Promise<AxiosResponse<RecordType[]>> = () => api.get('/record-types');

export const addUser = (user: User) => {
  return api.post('/users', user);
};

export const addRecord = (record: Record) => {
    return api.post('/records', record);
};

export const addRecordType = (recordType: RecordType) => {
    return api.post('/record-types', recordType);
};

export const uploadDocument = (recordId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recordId', recordId.toString());
    return api.post('/documents', formData);
};
