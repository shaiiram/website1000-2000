import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Experience } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Users, Baby, Bed, Minus, Plus, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const characterImageUrl = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7a3969a4f_100000000.png';
const backgroundImageUrl = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6ccc3899b_.png';

const NumberStepper = ({ value, setValue, min = 0, max = 10 }) => (
    <div className="flex items-center gap-4">
        <Button
            type="button"
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full bg-white/20 border-white/30"
            onClick={() => setValue(Math.max(min, value - 1))}
            disabled={value <= min}
        >
            <Minus className="w-4 h-4" />
        </Button>
        <span className="text-lg font-semibold w-4 text-center">{value}</span>
        <Button
            type="button"
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full bg-white/20 border-white/30"
            onClick={() => setValue(Math.min(max, value + 1))}
            disabled={value >= max}
        >
            <Plus className="w-4 h-4" />
        </Button>
    </div>
);

export default function Home() {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    useEffect(() => {
        const loadExperiences = async () => {
            const data = await Experience.list();
            setExperiences(data);
        };
        loadExperiences();
    }, []);

    const handleSearch = (budget) => {
        if (!selectedMonth || !selectedExperience) {
            alert('אנא בחרו חודש וחוויה רצויים');
            return;
        }
        const params = new URLSearchParams({
            experience: selectedExperience,
            month: selectedMonth,
            budget: budget,
            rooms: rooms.toString(),
            adults: adults.toString(),
            children: children.toString(),
            infants: infants.toString()
        });
        navigate(createPageUrl(`Results?${params.toString()}`));
    };

    const months = [
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'
    ];
    
    const travelerSummary = `${adults} מבוגרים` + (children > 0 ? `, ${children} ילדים` : '') + (infants > 0 ? `, ${infants} תינוקות` : '');

    return (
        <div 
            className="min-h-screen w-full bg-cover bg-center text-white" 
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            dir="rtl"
        >
            <div className="min-h-screen w-full bg-black/10 flex flex-col">
                <div className="text-center pt-8">
                    <h1 className="text-5xl font-bold" style={{ textShadow: '0 0 10px rgba(255,255,255,0.7)' }}>
                        1000-2000
                    </h1>
                </div>

                <div className="container mx-auto px-4 flex-grow flex items-center">
                    <div className="w-full grid lg:grid-cols-2 gap-8 items-end">
                        
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full max-w-md mx-auto"
                        >
                            <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-8 rounded-lg space-y-6">
                                {/* Month & Experience */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Select onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="bg-transparent h-12 text-lg"><SelectValue placeholder="בחר חודש" /></SelectTrigger>
                                        <SelectContent>
                                            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={setSelectedExperience}>
                                        <SelectTrigger className="bg-transparent h-12 text-lg"><SelectValue placeholder="בחרו חוויה" /></SelectTrigger>
                                        <SelectContent>
                                            {experiences.map(exp => <SelectItem key={exp.slug} value={exp.slug}>{exp.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Travelers */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full h-12 bg-transparent text-lg justify-between hover:bg-white/10">
                                            <span>{travelerSummary}</span>
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 bg-black/50 backdrop-blur-xl border-white/20 text-white" align="start">
                                        <div className="space-y-4 p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2"><Bed className="w-5 h-5" /> <span>חדרים</span></div>
                                                <NumberStepper value={rooms} setValue={setRooms} min={1} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2"><Users className="w-5 h-5" /> <span>מבוגרים</span></div>
                                                <NumberStepper value={adults} setValue={setAdults} min={1} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> <span>ילדים</span></div>
                                                <NumberStepper value={children} setValue={setChildren} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2"><Baby className="w-5 h-5" /> <span>תינוקות</span></div>
                                                <NumberStepper value={infants} setValue={setInfants} />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Budget Buttons */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Button onClick={() => handleSearch(1000)} className="h-14 text-xl bg-blue-900/80 hover:bg-blue-800/80 rounded-none">
                                        עד 1,000 ₪
                                    </Button>
                                    <Button onClick={() => handleSearch(2000)} className="h-14 text-xl bg-orange-600/80 hover:bg-orange-500/80 rounded-none">
                                        עד 2,000 ₪
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:flex flex-col items-center justify-end relative h-full"
                        >
                            <img 
                                src={characterImageUrl} 
                                alt="Sherry" 
                                className="max-h-[80vh] object-contain self-end"
                            />
                            <p className="absolute bottom-0 text-white/80 pb-4">שרי, העוזרת האישית שלכם</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}