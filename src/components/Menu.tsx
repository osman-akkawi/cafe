import React from 'react';

const menuItems = [
  {
    category: "Coffee",
    items: [
      { name: "Espresso", price: "$3.50", description: "Rich and bold single shot" },
      { name: "Cappuccino", price: "$4.50", description: "Espresso with steamed milk foam" },
      { name: "Latte", price: "$4.75", description: "Espresso with steamed milk and light foam" }
    ]
  },
  {
    category: "Pastries",
    items: [
      { name: "Croissant", price: "$3.75", description: "Buttery, flaky pastry" },
      { name: "Cinnamon Roll", price: "$4.25", description: "Fresh baked with cream cheese frosting" },
      { name: "Blueberry Muffin", price: "$3.50", description: "Made with fresh blueberries" }
    ]
  }
];

const Menu = () => {
  return (
    <section id="menu" className="py-24 bg-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Menu</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {menuItems.map((section) => (
            <div key={section.category} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-amber-600 mb-6">{section.category}</h3>
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.name} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-medium text-gray-800">{item.name}</h4>
                      <span className="text-amber-600 font-medium">{item.price}</span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;