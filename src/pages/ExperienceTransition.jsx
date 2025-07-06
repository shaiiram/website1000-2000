import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function ExperienceTransition() {
    const navigate = useNavigate();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const budget = urlParams.get('budget');

        if (slug) {
            const loadExperience = async () => {
                try {
                    const experiences = await Experience.filter({ slug: slug });
                    if (experiences.length > 0) {
                        setExperience(experiences[0]);
                    } else {
                        navigate(createPageUrl("Home"));
                    }
                } catch (error) {
                    console.error("Error loading experience:", error);
                    navigate(createPageUrl("Home"));
                } finally {
                    setLoading(false);
                }
            };
            loadExperience();
        } else {
            navigate(createPageUrl("Home"));
        }
    }, [navigate]);

    useEffect(() => {
        if (experience) {
            const timer = setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const budget = urlParams.get('budget');
                navigate(createPageUrl(`SelectMonth?slug=${experience.slug}&budget=${budget}`));
            }, 5000); 

            return () => clearTimeout(timer);
        }
    }, [experience, navigate]);

    if (loading || !experience) {
        return (
            <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-lg flex flex-col items-center justify-center z-50 p-4" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, type: 'spring' }}
                className="text-center"
            >
                <img
                    src={experience.character_image_url}
                    alt={experience.name}
                    className="max-h-[60vh] max-w-full object-contain mb-8 mx-auto"
                />
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                    {experience.name}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-xl md:text-2xl text-white bg-black/30 p-4 rounded-xl max-w-2xl mx-auto"
                >
                    "{experience.transition_quote}"
                </motion.p>
            </motion.div>
        </div>
    );
}