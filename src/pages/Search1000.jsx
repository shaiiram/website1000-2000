import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Experience } from '@/api/entities';
import { motion } from 'framer-motion';

export default function Search1000() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await Experience.list('-created_date', 12);
        setExperiences(data.reverse()); // To keep a somewhat consistent order for the user
      } catch (error) {
        console.error("Error loading experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  const handleExperienceClick = (experience) => {
    navigate(createPageUrl(`ExperienceTransition?slug=${experience.slug}&budget=1000`));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723a996fde1?auto=format&fit=crop&w=1200&q=80')"}} dir="rtl">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-tiktok">
            חוויות עד 1,000 ₪
          </h1>
          <p className="text-xl text-white/90">בחרו את החוויה המושלמת עבורכם</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleExperienceClick(experience)}
              className="cursor-pointer group"
            >
              <div className="bg-transparent rounded-2xl p-4 transition-all duration-300 hover:scale-105">
                <img 
                  src={experience.image_url} 
                  alt={experience.name}
                  className="w-full h-40 object-contain rounded-xl mb-4"
                />
                <h3 className="text-white font-bold text-lg text-center group-hover:text-amber-300 transition-colors">
                  {experience.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}