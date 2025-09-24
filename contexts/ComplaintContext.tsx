
import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Complaint } from '../types';
import { mockComplaints } from '../utils/mockData';

type Action =
  | { type: 'SET_COMPLAINTS'; payload: Complaint[] }
  | { type: 'ADD_COMPLAINT'; payload: Complaint }
  | { type: 'UPDATE_COMPLAINT'; payload: Complaint };

interface ComplaintContextType {
  complaints: Complaint[];
  dispatch: React.Dispatch<Action>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const complaintsReducer = (state: Complaint[], action: Action): Complaint[] => {
  switch (action.type) {
    case 'SET_COMPLAINTS':
        return action.payload;
    case 'ADD_COMPLAINT':
      // Prepend the new complaint to the list for immediate UI update.
      return [action.payload, ...state];
    case 'UPDATE_COMPLAINT':
      // Update the complaint in the client-side state.
      return state.map(c => (c.id === action.payload.id ? action.payload : c));
    default:
      return state;
  }
};

const LOCAL_STORAGE_KEY = 'csDepartmentComplaints';

// This initializer function runs once when the reducer is created.
// It loads the initial state from localStorage or falls back to mock data.
const initializer = (): Complaint[] => {
  try {
    const storedComplaints = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedComplaints) {
      const parsedComplaints = JSON.parse(storedComplaints);
      // JSON.stringify converts Date objects to strings, so we need to convert them back.
      return parsedComplaints.map((c: any) => ({
        ...c,
        submittedAt: new Date(c.submittedAt),
        resolvedAt: c.resolvedAt ? new Date(c.resolvedAt) : undefined,
        dueDate: c.dueDate ? new Date(c.dueDate) : undefined,
        history: c.history.map((h: any) => ({
          ...h,
          changedAt: new Date(h.changedAt),
        })),
      }));
    }
  } catch (error) {
    console.error("Failed to parse complaints from localStorage", error);
    // If parsing fails, we'll fall through and use mock data.
  }

  // If localStorage is empty or parsing failed, initialize with mock data
  // and save it to localStorage for the next load.
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockComplaints));
  return mockComplaints;
};

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, dispatch] = useReducer(complaintsReducer, undefined, initializer);

  // This effect runs whenever the 'complaints' state changes,
  // saving the updated state to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    } catch (error) {
      console.error("Failed to save complaints to localStorage", error);
    }
  }, [complaints]);

  return (
    <ComplaintContext.Provider value={{ complaints, dispatch }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = (): ComplaintContextType => {
  const context = React.useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};