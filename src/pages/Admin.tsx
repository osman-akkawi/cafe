import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useMenuStore, MenuItem, MenuCategory } from '../store/menuStore';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/ImageUpload';
import { motion } from 'framer-motion';

interface EditingState {
  type: 'category' | 'item';
  categoryId?: string;
  item?: MenuItem;
  category?: MenuCategory;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { categories, addCategory, updateCategory, deleteCategory, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuStore();
  
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newItem, setNewItem] = useState<{ categoryId: string; item: Omit<MenuItem, 'id' | 'category_id'> } | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddCategory = async () => {
    await addCategory(newCategory);
    setNewCategory({ name: '', description: '' });
  };

  const handleUpdateCategory = async (id: string, category: Partial<MenuCategory>) => {
    await updateCategory(id, category);
    setEditing(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const handleAddItem = async () => {
    if (newItem) {
      await addMenuItem(newItem.categoryId, newItem.item);
      setNewItem(null);
    }
  };

  const handleUpdateItem = async (categoryId: string, itemId: string, item: Partial<MenuItem>) => {
    await updateMenuItem(categoryId, itemId, item);
    setEditing(null);
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(categoryId, itemId);
    }
  };

  const handleImageUpload = async (file: File, itemId?: string) => {
    try {
      const imageUrl = await useMenuStore.getState().uploadImage(file);
      
      if (itemId && editing?.item) {
        await handleUpdateItem(editing.categoryId!, itemId, { ...editing.item, image: imageUrl });
      } else if (newItem) {
        setNewItem({
          ...newItem,
          item: { ...newItem.item, image: imageUrl }
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Categories Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
            <button
              onClick={() => setNewCategory({ name: '', description: '' })}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>

          {/* New Category Form */}
          {newCategory && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border rounded-md"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Category Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setNewCategory({ name: '', description: '' })}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-md p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing({ type: 'category', category })}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/50'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.price}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditing({ type: 'item', categoryId: category.id, item })}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(category.id, item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add Item Button */}
                <button
                  onClick={() => setNewItem({
                    categoryId: category.id,
                    item: { name: '', description: '', price: '', image: '' }
                  })}
                  className="mt-4 text-amber-600 hover:text-amber-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Edit {editing.type === 'category' ? 'Category' : 'Item'}
                </h3>
                <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editing.type === 'category' && editing.category && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editing.category.name}
                    onChange={(e) => setEditing({
                      ...editing,
                      category: { ...editing.category!, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    value={editing.category.description}
                    onChange={(e) => setEditing({
                      ...editing,
                      category: { ...editing.category!, description: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateCategory(editing.category!.id, editing.category!)}
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {editing.type === 'item' && editing.item && (
                <div className="space-y-4">
                  <ImageUpload
                    onImageSelect={(file) => handleImageUpload(file, editing.item?.id)}
                    currentImage={editing.item.image}
                    onRemoveImage={() => {
                      if (editing.item) {
                        handleUpdateItem(editing.categoryId!, editing.item.id, { ...editing.item, image: '' });
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={editing.item.name}
                    onChange={(e) => setEditing({
                      ...editing,
                      item: { ...editing.item!, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Item Name"
                  />
                  <input
                    type="text"
                    value={editing.item.description}
                    onChange={(e) => setEditing({
                      ...editing,
                      item: { ...editing.item!, description: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={editing.item.price}
                    onChange={(e) => setEditing({
                      ...editing,
                      item: { ...editing.item!, price: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Price"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editing.item && editing.categoryId) {
                          handleUpdateItem(editing.categoryId, editing.item.id, editing.item);
                        }
                      }}
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* New Item Modal */}
        {newItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Item</h3>
                <button onClick={() => setNewItem(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <ImageUpload
                  onImageSelect={(file) => handleImageUpload(file)}
                  currentImage={newItem.item.image}
                  onRemoveImage={() => {
                    setNewItem({
                      ...newItem,
                      item: { ...newItem.item, image: '' }
                    });
                  }}
                />
                <input
                  type="text"
                  value={newItem.item.name}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    item: { ...newItem.item, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Item Name"
                />
                <input
                  type="text"
                  value={newItem.item.description}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    item: { ...newItem.item, description: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={newItem.item.price}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    item: { ...newItem.item, price: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Price"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setNewItem(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;