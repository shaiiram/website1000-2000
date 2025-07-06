import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Booking } from '@/api/entities';
import { Experience } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Briefcase, Info } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const [bookingsData, experiencesData] = await Promise.all([
          Booking.filter({ created_by: currentUser.email }, '-created_date'),
          Experience.list()
        ]);
        
        setBookings(bookingsData);
        setExperiences(experiencesData);
      } catch (error) {
        console.error("User not logged in or error loading data:", error);
        navigate(createPageUrl('Home'));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const getExperienceName = (slug) => {
    const experience = experiences.find(exp => exp.slug === slug);
    return experience ? experience.name : slug;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'cancelled': return 'מבוטל';
      default: return 'בהמתנה';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">ההזמנות שלי</h1>
        <p className="text-lg text-gray-600 mb-12">צפייה בכל החוויות שהזמנת דרכנו.</p>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">עדיין לא הזמנת כלום</h2>
            <p className="text-gray-500 mt-2">זה הזמן לצאת להרפתקה! כל ההזמנות שלך יופיעו כאן.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <Card key={booking.id} className="sherry-glow overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-amber-700">
                      {booking.package_name || getExperienceName(booking.experience_slug)}
                    </CardTitle>
                    <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                  </div>
                  <div className="text-sm text-gray-500 pt-2">
                    הוזמן ב: {format(new Date(booking.created_date), 'd בMMMM, yyyy', { locale: he })}
                  </div>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold">תאריך מועדף</div>
                      <div>{format(new Date(booking.preferred_date), 'd בMMMM, yyyy', { locale: he })}</div>
                    </div>
                  </div>
                   <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold">מחיר</div>
                      <div>{booking.price ? `${booking.price} ₪` : 'לא צוין'}</div>
                    </div>
                  </div>
                  {booking.special_requests && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <Info className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">בקשות מיוחדות</div>
                        <p className="text-gray-600">{booking.special_requests}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}