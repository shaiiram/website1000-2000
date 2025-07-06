import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Booking } from '@/api/entities';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, User as UserIcon, Calendar, Phone, Mail, Lock, ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [packageDetails, setPackageDetails] = useState({ title: '', price: '', slug: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setPackageDetails({
            title: urlParams.get('packageTitle') || 'חוויה מותאמת אישית',
            price: urlParams.get('price') || 'לא נקבע',
            slug: urlParams.get('slug') || 'custom-experience'
        });

        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                setValue('customer_name', currentUser.full_name);
                setValue('customer_email', currentUser.email);
            } catch (error) {
                // Not logged in, form will be empty
            }
        };
        fetchUser();
    }, [setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (!user) {
                alert("יש להתחבר למערכת כדי לבצע הזמנה.");
                await User.loginWithRedirect(window.location.href);
                return;
            }
            const newBooking = await Booking.create({
                experience_slug: packageDetails.slug,
                package_name: packageDetails.title,
                price: packageDetails.price,
                customer_name: data.customer_name,
                customer_email: data.customer_email,
                customer_phone: data.customer_phone,
                preferred_date: data.preferred_date,
                number_of_people: parseInt(data.number_of_people, 10),
                special_requests: data.special_requests,
                status: 'pending',
            });
            navigate(createPageUrl(`ThankYou?id=${newBooking.id}`));
        } catch (error) {
            console.error('Failed to create booking:', error);
            alert('אירעה שגיאה. אנא נסה שוב.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 mb-8 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                        <span>חזרה</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">סיום הזמנה</h1>
                    <p className="text-lg text-gray-600 mb-8">כמעט שם! רק נשלים כמה פרטים קטנים.</p>
                </motion.div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* פרטי הנוסע */}
                        <Card className="sherry-glow">
                            <CardHeader><CardTitle className="flex items-center gap-3"><UserIcon /> פרטי מזמין</CardTitle></CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customer_name">שם מלא</Label>
                                    <Input id="customer_name" {...register('customer_name', { required: 'שדה חובה' })} />
                                    {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="customer_email">אימייל</Label>
                                    <Input id="customer_email" type="email" {...register('customer_email', { required: 'שדה חובה', pattern: { value: /^\S+@\S+$/i, message: "כתובת אימייל לא תקינה" } })} />
                                     {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="customer_phone">טלפון</Label>
                                    <Input id="customer_phone" {...register('customer_phone', { required: 'שדה חובה' })} />
                                    {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* פרטי החוויה */}
                         <Card className="sherry-glow">
                            <CardHeader><CardTitle className="flex items-center gap-3"><Calendar /> פרטי החוויה</CardTitle></CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="preferred_date">תאריך מועדף</Label>
                                    <Input id="preferred_date" type="date" {...register('preferred_date', { required: 'שדה חובה' })} />
                                    {errors.preferred_date && <p className="text-red-500 text-sm mt-1">{errors.preferred_date.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="number_of_people">מספר משתתפים</Label>
                                    <Input id="number_of_people" type="number" defaultValue="1" {...register('number_of_people', { required: 'שדה חובה', min: { value: 1, message: "חייב להיות לפחות משתתף אחד" } })} />
                                    {errors.number_of_people && <p className="text-red-500 text-sm mt-1">{errors.number_of_people.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                     <Label htmlFor="special_requests">בקשות מיוחדות</Label>
                                     <Textarea id="special_requests" {...register('special_requests')} placeholder="אלרגיות, העדפות, חגיגות..." />
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* פרטי תשלום */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><CreditCard /> פרטי תשלום</CardTitle>
                                <CardDescription>הפרטים מאובטחים. החיוב יתבצע רק לאחר אישור סופי טלפוני.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="card_number">מספר כרטיס</Label>
                                    <Input id="card_number" placeholder="•••• •••• •••• ••••" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="exp_date">תוקף</Label>
                                        <Input id="exp_date" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" placeholder="•••" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* סיכום הזמנה */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-28 sherry-glow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><Package /> סיכום הזמנה</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">שם החבילה:</span>
                                    <span className="font-semibold">{packageDetails.title}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl">
                                    <span>סה"כ לתשלום:</span>
                                    <span>{packageDetails.price}</span>
                                </div>
                                <p className="text-xs text-gray-500">המחיר סופי ויאושר טלפונית. אין חיובים נסתרים.</p>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg py-6" disabled={isLoading}>
                                    {isLoading ? 'שולח...' : 'שליחת הזמנה ואישור טלפוני'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    );
}