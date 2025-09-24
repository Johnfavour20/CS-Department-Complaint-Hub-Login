import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';

// Placeholder for a receipt image (1x1 transparent pixel)
const placeholderReceiptUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const mockComplaints: Complaint[] = [
  {
    id: `C-${crypto.randomUUID()}`,
    studentName: 'Ada Okoro',
    studentId: 'U2021/5570009',
    category: ComplaintCategory.ACADEMIC,
    description: 'My grade for COS 301 was not recorded correctly. I believe there has been a mistake in the calculation. I have my test scripts as proof.',
    status: ComplaintStatus.IN_PROGRESS,
    submittedAt: new Date('2024-05-20T10:00:00Z'),
    resolvedAt: undefined,
    adminNotes: 'Contacted the department head. Waiting for feedback on the grade review process.',
    history: [
      { status: ComplaintStatus.SUBMITTED, changedAt: new Date('2024-05-20T10:00:00Z'), notes: 'Complaint submitted by student.' },
      { status: ComplaintStatus.IN_PROGRESS, changedAt: new Date('2024-05-21T14:30:00Z'), notes: 'Assigned to academic affairs. Awaiting course adviser\'s response.' },
    ],
    isReadByAdmin: true,
    dueDate: new Date('2024-06-10T23:59:59Z'),
  },
  {
    id: `C-${crypto.randomUUID()}`,
    studentName: 'Bolanle Adeyemi',
    studentId: 'U2020/5512345',
    category: ComplaintCategory.FACILITIES,
    description: 'The air conditioning unit in Lecture Hall 2 has been faulty for over a week, making lectures very uncomfortable.',
    status: ComplaintStatus.RESOLVED,
    submittedAt: new Date('2024-05-18T09:30:00Z'),
    resolvedAt: new Date('2024-05-22T11:00:00Z'),
    adminNotes: 'Maintenance team was dispatched and has repaired the AC unit. Issue confirmed resolved.',
    history: [
      { status: ComplaintStatus.SUBMITTED, changedAt: new Date('2024-05-18T09:30:00Z') },
      { status: ComplaintStatus.IN_PROGRESS, changedAt: new Date('2024-05-18T12:00:00Z'), notes: 'Ticket raised with the maintenance department.' },
      { status: ComplaintStatus.RESOLVED, changedAt: new Date('2024-05-22T11:00:00Z'), notes: 'Unit repaired and tested successfully.' },
    ],
    isReadByAdmin: true,
    dueDate: new Date('2024-05-25T23:59:59Z'),
  },
   {
    id: `C-${crypto.randomUUID()}`,
    studentName: 'Chukwudi Eze',
    studentId: 'U2022/5598765',
    category: ComplaintCategory.FINANCIAL,
    description: 'I paid my school fees two weeks ago but my portal still shows that I have an outstanding balance. My remita receipt is attached.',
    status: ComplaintStatus.SUBMITTED,
    submittedAt: new Date(),
    resolvedAt: undefined,
    adminNotes: undefined,
    history: [
      { status: ComplaintStatus.SUBMITTED, changedAt: new Date() },
    ],
    isReadByAdmin: false,
    dueDate: undefined,
    attachment: {
        name: 'school_fees_receipt.png',
        size: 123456, // 123 KB
        type: 'image/png',
        dataUrl: placeholderReceiptUrl
    }
  },
  {
    id: `C-${crypto.randomUUID()}`,
    studentName: 'Fatima Sani',
    studentId: 'U2019/5545678',
    category: ComplaintCategory.ADMINISTRATIVE,
    description: 'I applied for a transcript a month ago and have not received any update on its status. The application ID is T-45678.',
    status: ComplaintStatus.CLOSED,
    submittedAt: new Date('2024-04-15T15:00:00Z'),
    resolvedAt: new Date('2024-04-20T16:00:00Z'),
    adminNotes: 'Transcript was processed and dispatched on April 19th. Student confirmed receipt. Closing ticket.',
    history: [
      { status: ComplaintStatus.SUBMITTED, changedAt: new Date('2024-04-15T15:00:00Z') },
      { status: ComplaintStatus.IN_PROGRESS, changedAt: new Date('2024-04-16T10:00:00Z'), notes: 'Forwarded to exams and records.' },
      { status: ComplaintStatus.RESOLVED, changedAt: new Date('2024-04-20T16:00:00Z'), notes: 'Transcript sent.' },
      { status: ComplaintStatus.CLOSED, changedAt: new Date('2024-04-21T09:00:00Z') },
    ],
    isReadByAdmin: true,
    dueDate: undefined,
  },
  {
    id: `C-${crypto.randomUUID()}`,
    studentName: 'Emeka Nwosu',
    studentId: 'U2021/5570010',
    category: ComplaintCategory.HARASSMENT,
    description: 'A security guard at the main gate was verbally abusive and refused me entry without a valid reason, even after showing my ID card.',
    status: ComplaintStatus.IN_PROGRESS,
    submittedAt: new Date('2024-05-23T18:00:00Z'),
    resolvedAt: undefined,
    adminNotes: 'Chief Security Officer has been notified and an investigation is underway. The student has been contacted for more details.',
    history: [
      { status: ComplaintStatus.SUBMITTED, changedAt: new Date('2024-05-23T18:00:00Z') },
      { status: ComplaintStatus.IN_PROGRESS, changedAt: new Date('2024-05-24T09:15:00Z'), notes: 'Incident escalated to CSO.' },
    ],
    isReadByAdmin: true,
    dueDate: new Date('2024-06-05T23:59:59Z'),
  },
];