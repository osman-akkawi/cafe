import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            alt="Café atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to Café Serenity</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of artisanal coffee and homemade pastries in a cozy atmosphere
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center bg-amber-600 text-white px-8 py-4 rounded-md hover:bg-amber-700 transition-colors duration-200"
          >
            Explore Our Menu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take pride in delivering the finest coffee experience with our commitment to quality and service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Coffee,
                title: 'Premium Coffee',
                description: 'Sourced from the finest beans around the world',
              },
              {
                icon: Users,
                title: 'Welcoming Space',
                description: 'A cozy environment perfect for work or relaxation',
              },
              {
                icon: Star,
                title: 'Expert Baristas',
                description: 'Crafting the perfect cup with passion and precision',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Experience the Best Coffee?</h2>
          <p className="text-gray-600 mb-8">Visit us today and discover why we're the city's favorite café.</p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors duration-200"
          >
            Find Us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;