import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Experience } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Tag, Check, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExperienceDetails() {
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (slug) {
      loadExperience(slug);
    } else {
      navigate(createPageUrl("Experiences"));
    }
  }, [navigate]);

  const loadExperience = async (slug) => {
    setLoading(true);
    try {
      const experiences = await Experience.filter({ slug: slug });
      if (experiences.length > 0) {
        setExperience(experiences[0]);
      } else {
        navigate(createPageUrl("Experiences"));
      }
    } catch (error) {
      console.error("Error loading experience:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!experience) {
    return null;
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="relative h-[50vh]">
        <img src={experience.image_url} alt={experience.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-bold"
          >
            {experience.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl mt-2"
          >
            {experience.location}
          </motion.p>
        </div>
        <button
          onClick={() => navigate(createPageUrl("Experiences"))}
          className="absolute top-8 right-8 flex items-center space-x-2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 p-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">תיאור החוויה</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {experience.detailed_description || experience.description}
          </p>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">מה כלול בחוויה</h3>
          <ul className="space-y-3">
            {(experience.highlights || []).map((highlight, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-500 bg-green-100 rounded-full p-1" />
                <span className="text-gray-700">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-lg sherry-glow">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-gray-500">טווח מחירים</div>
                <div className="text-2xl font-bold text-gray-800">{experience.price_range}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-gray-500">קטגוריה</div>
                <div className="text-2xl font-bold text-gray-800">{experience.category}</div>
              </div>
            </div>
            
            <h3 className="text-center text-xl font-semibold mb-4">מוכנים לצאת לדרך?</h3>
            <div className="space-y-3">
               <Button onClick={() => navigate(createPageUrl("Search1000"))} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-md">
                מצא חבילות עד 1,000 ₪
              </Button>
               <Button onClick={() => navigate(createPageUrl("Search2000"))} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-md">
                מצא חבילות עד 2,000 ₪
              </Button>
               <Button onClick={() => navigate(createPageUrl("SearchFree"))} variant="outline" className="w-full py-3 text-md">
                 <Search className="w-4 h-4 ml-2" />
                חיפוש חופשי
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}