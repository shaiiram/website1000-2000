import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Booking } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Package, User, Calendar, Phone, Edit, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function ThankYou() {
    const navigate = useNavigate();
    const location = useLocation();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const bookingId = urlParams.get('id');

        if (bookingId) {
            const fetchBooking = async () => {
                try {
                    const fetchedBooking = await Booking.get(bookingId);
                    setBooking(fetchedBooking);
                } catch (error) {
                    console.error("Failed to fetch booking:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBooking();
        } else {
            setLoading(false);
        }
    }, [location.search]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
            </div>
        );
    }
    
    if (!booking) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center text-center p-8" dir="rtl">
                <h1 className="text-2xl font-bold text-red-600">שגיאה: לא נמצאה הזמנה.</h1>
                <Button onClick={() => navigate(createPageUrl('Home'))} className="mt-4">חזרה לדף הבית</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-2xl"
            >
                <Card className="sherry-glow text-center">
                    <CardHeader>
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <CardTitle className="text-3xl font-bold mt-4">תודה רבה!</CardTitle>
                        <p className="text-lg text-gray-600">ההזמנה שלך התקבלה בהצלחה.</p>
                        <p className="text-gray-500">נציג מטעמנו ייצור עמך קשר טלפוני לאישור סופי של הפרטים והתשלום.</p>
                    </CardHeader>
                    <CardContent className="text-right space-y-4">
                        <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Package/> סיכום הזמנה</h3>
                        <div className="border rounded-lg p-4 space-y-2">
                            <p><strong>שם החבילה:</strong> {booking.package_name}</p>
                            <p><strong>שם המזמין:</strong> {booking.customer_name}</p>
                            <p><strong>תאריך מועדף:</strong> {format(new Date(booking.preferred_date), 'd בMMMM, yyyy', { locale: he })}</p>
                            <p><strong>סה"כ לתשלום (לאחר אישור):</strong> {booking.price}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col sm:flex-row gap-4">
                       <Link to={createPageUrl("Contact")} className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full">
                                <Edit className="ml-2 h-4 w-4" />
                                עריכת ההזמנה
                            </Button>
                       </Link>
                       <Link to={createPageUrl("Home")} className="w-full sm:w-auto">
                           <Button className="w-full">
                               <Home className="ml-2 h-4 w-4" />
                                חזרה לדף הבית
                           </Button>
                       </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}