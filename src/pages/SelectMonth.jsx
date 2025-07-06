import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Experience } from '@/api/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SelectMonth() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [experience, setExperience] = useState(null);
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const budgetParam = urlParams.get('budget');
    
    setBudget(budgetParam);

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
        }
      };
      loadExperience();
    } else {
      navigate(createPageUrl("Home"));
    }
  }, [navigate]);

  const months = [
    { name: 'ינואר', value: 'January' },
    { name: 'פברואר', value: 'February' },
    { name: 'מרץ', value: 'March' },
    { name: 'אפריל', value: 'April' },
    { name: 'מאי', value: 'May' },
    { name: 'יוני', value: 'June' },
    { name: 'יולי', value: 'July' },
    { name: 'אוגוסט', value: 'August' },
    { name: 'ספטמבר', value: 'September' },
    { name: 'אוקטובר', value: 'October' },
    { name: 'נובמבר', value: 'November' },
    { name: 'דצמבר', value: 'December' }
  ];

  const handleContinue = () => {
    if (selectedMonth && experience) {
      navigate(createPageUrl(`Results?experience=${experience.slug}&month=${selectedMonth}&budget=${budget}`));
    }
  };

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723a996fde1?auto=format&fit=crop&w=1200&q=80')"}} dir="rtl">
      <div className="min-h-screen w-full bg-black/40 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-tiktok">
            מתי תרצה לצאת לחופשה?
          </h1>
          <p className="text-2xl text-white/90 mb-8">
            חוויה נבחרת: {experience.name}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full"
        >
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full h-16 text-lg bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="בחר חודש" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleContinue}
            disabled={!selectedMonth}
            className="w-full mt-6 h-16 text-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
          >
            מצא לי חופשה 🎁
          </Button>
        </motion.div>
      </div>
    </div>
  );
}