// =========== Type definitions ========== //
// ~~~~~~~~ Record type ~~~~~~~~ //
export type Record = {
  id: number;
  patientID: number;
  date: string;
  typeID: number;
  doctor_name?: string | null;
  notes?: string | null;
};

// ~~~~~~~~ User type ~~~~~~~~ //

export type User = {
  ID: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
};

// ~~~~~~~~ Record Type - type ~~~~~~~~ //

export type RecordType = {
  ID: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};