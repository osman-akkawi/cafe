import React from 'react';
import { Coffee, Users, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">About Us</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
              alt="Café interior"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2010, Café Serenity has been a haven for coffee lovers and food enthusiasts alike. 
              We believe in creating more than just great coffee - we're creating a community where people 
              can connect, relax, and enjoy life's simple pleasures.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <Coffee className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h4 className="font-medium">Quality Coffee</h4>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h4 className="font-medium">Community</h4>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h4 className="font-medium">Passion</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;