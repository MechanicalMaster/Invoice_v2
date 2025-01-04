import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Item } from '../types';

interface ItemsContextType {
  items: Item[];
  loading: boolean;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, item: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'items'),
      where('userId', '==', user.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData: Item[] = [];
      snapshot.forEach((doc) => {
        itemsData.push({
          id: doc.id,
          ...doc.data() as Omit<Item, 'id'>
        });
      });
      setItems(itemsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching items:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createItem = async (itemData: Omit<Item, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newItemData = {
        ...itemData,
        userId: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        name: itemData.name || '',
        description: itemData.description || '',
        price: itemData.price || 0,
        dimensions: itemData.dimensions || '',
        category: itemData.category || ''
      };

      const docRef = await addDoc(collection(db, 'items'), newItemData);

      const newItem: Item = {
        id: docRef.id,
        ...newItemData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, itemData: Partial<Item>) => {
    try {
      const now = new Date();
      await updateDoc(doc(db, 'items', id), {
        ...itemData,
        updatedAt: now
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                ...itemData,
                updatedAt: now
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  return (
    <ItemsContext.Provider value={{ items, loading, addItem: createItem, updateItem, deleteItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
} 