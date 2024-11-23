import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category_id: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

interface MenuState {
  categories: MenuCategory[];
  loading: boolean;
  uploadImage: (file: File) => Promise<string>;
  deleteImage: (path: string) => Promise<void>;
  fetchMenu: () => Promise<void>;
  addCategory: (category: Omit<MenuCategory, 'id' | 'items'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<MenuCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addMenuItem: (categoryId: string, item: Omit<MenuItem, 'id' | 'category_id'>) => Promise<void>;
  updateMenuItem: (categoryId: string, itemId: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (categoryId: string, itemId: string) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  loading: false,

  uploadImage: async (file: File) => {
    const BUCKET_NAME = 'menu-images';
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 2MB limit');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!fileExt || !validExtensions.includes(fileExt)) {
        throw new Error('Invalid file type. Allowed types: JPG, PNG, GIF, WebP');
      }

      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          const newFileName = `${uuidv4()}_${Date.now()}.${fileExt}`;
          const newFilePath = `menu-items/${newFileName}`;
          
          const { error: retryError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(newFilePath, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type
            });

          if (retryError) throw retryError;
          
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(newFilePath);
            
          return publicUrl;
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
      throw error;
    }
  },

  deleteImage: async (path: string) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      if (!path) return;

      const BUCKET_NAME = 'menu-images';
      const imagePath = path.split('/').pop();
      
      if (!imagePath) {
        throw new Error('Invalid image path');
      }

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([`menu-items/${imagePath}`]);

      if (error) throw error;

      toast.success('Image deleted successfully');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
    }
  },

  fetchMenu: async () => {
    try {
      set({ loading: true });
      
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at');

      if (categoriesError) throw categoriesError;

      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at');

      if (itemsError) throw itemsError;

      const organizedCategories = categories.map(category => ({
        ...category,
        items: items.filter(item => item.category_id === category.id) || []
      }));

      set({ categories: organizedCategories });
    } catch (error: any) {
      console.error('Error fetching menu:', error);
      toast.error(error.message || 'Failed to fetch menu');
    } finally {
      set({ loading: false });
    }
  },

  addCategory: async (category) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        categories: [...state.categories, { ...data, items: [] }]
      }));

      toast.success('Category added successfully');
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error(error.message || 'Failed to add category');
    }
  },

  updateCategory: async (id, category) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      const { error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        categories: state.categories.map(cat =>
          cat.id === id ? { ...cat, ...category } : cat
        )
      }));

      toast.success('Category updated successfully');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.message || 'Failed to update category');
    }
  },

  deleteCategory: async (id) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));

      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  },

  addMenuItem: async (categoryId, item) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([{ ...item, category_id: categoryId }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, data] }
            : cat
        )
      }));

      toast.success('Menu item added successfully');
    } catch (error: any) {
      console.error('Error adding menu item:', error);
      toast.error(error.message || 'Failed to add menu item');
    }
  },

  updateMenuItem: async (categoryId, itemId, item) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      const { error } = await supabase
        .from('menu_items')
        .update(item)
        .eq('id', itemId);

      if (error) throw error;

      set(state => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map(menuItem =>
                  menuItem.id === itemId
                    ? { ...menuItem, ...item }
                    : menuItem
                )
              }
            : cat
        )
      }));

      toast.success('Menu item updated successfully');
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      toast.error(error.message || 'Failed to update menu item');
    }
  },

  deleteMenuItem: async (categoryId, itemId) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Unauthorized: Please login first');
      }

      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      set(state => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.filter(item => item.id !== itemId)
              }
            : cat
        )
      }));

      toast.success('Menu item deleted successfully');
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      toast.error(error.message || 'Failed to delete menu item');
    }
  }
}));