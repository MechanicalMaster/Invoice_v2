import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Invoice } from '../types';

interface InvoicesContextType {
  invoices: Invoice[];
  loading: boolean;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'invoices'),
      where('userId', '==', user.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoicesData: Invoice[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        invoicesData.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(),
        });
      });
      setInvoices(invoicesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const docRef = await addDoc(collection(db, 'invoices'), {
        ...invoiceData,
        userId: user.id,
        date: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      const newInvoice: Invoice = {
        id: docRef.id,
        ...invoiceData,
        date: new Date()
      };

      setInvoices(prev => [...prev, newInvoice]);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      await updateDoc(doc(db, 'invoices', id), invoiceData);
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, ...invoiceData } : invoice
        )
      );
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  };

  return (
    <InvoicesContext.Provider
      value={{ invoices, loading, createInvoice, updateInvoice, deleteInvoice }}
    >
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
} 