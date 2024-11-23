import React from 'react';
import { motion } from 'framer-motion';
import { useMenuStore } from '../store/menuStore';

const Menu = () => {
  const { categories } = useMenuStore();

  return (
    <div className="pt-24 pb-16 bg-amber-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of coffee, pastries, and light bites.
            Everything is made fresh daily with the finest ingredients.
          </p>
        </motion.div>

        <div className="space-y-20">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (categoryIndex * 0.2) + (itemIndex * 0.1) }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'}
                        alt={item.name}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-0 right-0 bg-amber-600 text-white px-4 py-2 rounded-bl-lg">
                        {item.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No menu items available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;