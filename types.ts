

export enum ComplaintStatus {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export enum ComplaintCategory {
  ACADEMIC = 'Academic',
  ADMINISTRATIVE = 'Administrative',
  FACILITIES = 'Facilities',
  HARASSMENT = 'Harassment/Security',
  FINANCIAL = 'Financial',
  OTHER = 'Other',
}

export interface ComplaintAttachment {
    name: string;
    size: number; // in bytes
    type: string; // MIME type
    dataUrl: string; // Base64 encoded data URL
}

export interface Complaint {
  id: string;
  studentName: string;
  studentId: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  submittedAt: Date;
  resolvedAt?: Date;
  adminNotes?: string;
  history: { status: ComplaintStatus; changedAt: Date; notes?: string }[];
  isReadByAdmin?: boolean;
  dueDate?: Date;
  attachment?: ComplaintAttachment;
}

export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin',
    NONE = 'none'
}

export interface User {
    role: UserRole;
    id: string;
    name: string;
    profilePictureUrl?: string;
    department?: string;
    level?: number;
    email?: string;
    phone?: string;
}