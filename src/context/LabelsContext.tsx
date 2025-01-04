import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Label } from '../types';

interface LabelsContextType {
  labels: Label[];
  loading: boolean;
  createLabel: (label: Omit<Label, 'id' | 'createdAt'>) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
}

const LabelsContext = createContext<LabelsContextType | undefined>(undefined);

export function LabelsProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLabels([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'labels'),
      where('userId', '==', user.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const labelsData: Label[] = [];
      snapshot.forEach((doc) => {
        labelsData.push({
          id: doc.id,
          ...doc.data() as Omit<Label, 'id'>
        });
      });
      setLabels(labelsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching labels:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createLabel = async (labelData: Omit<Label, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const docRef = await addDoc(collection(db, 'labels'), {
        ...labelData,
        userId: user.id,
        createdAt: serverTimestamp()
      });

      const newLabel: Label = {
        id: docRef.id,
        ...labelData
      };

      setLabels(prev => [...prev, newLabel]);
    } catch (error) {
      console.error('Error creating label:', error);
      throw error;
    }
  };

  const deleteLabel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'labels', id));
      setLabels((prevLabels) => prevLabels.filter((label) => label.id !== id));
    } catch (error) {
      console.error('Error deleting label:', error);
      throw error;
    }
  };

  return (
    <LabelsContext.Provider value={{ labels, loading, createLabel, deleteLabel }}>
      {children}
    </LabelsContext.Provider>
  );
}

export function useLabels() {
  const context = useContext(LabelsContext);
  if (context === undefined) {
    throw new Error('useLabels must be used within a LabelsProvider');
  }
  return context;
} 