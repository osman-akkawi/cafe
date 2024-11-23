import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
          alt="Café atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Café Serenity</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Experience the perfect blend of artisanal coffee and homemade pastries in a cozy atmosphere
        </p>
        <a
          href="#menu"
          className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200"
        >
          View Our Menu
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;