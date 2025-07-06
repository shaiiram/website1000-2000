import React, { useState, useEffect } from "react";
import { Booking } from "@/api/entities";
import { Experience } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Phone, Mail, Users, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, experiencesData] = await Promise.all([
        Booking.list('-created_date'),
        Experience.list()
      ]);
      setBookings(bookingsData);
      setExperiences(experiencesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExperienceName = (slug) => {
    const experience = experiences.find(exp => exp.slug === slug);
    return experience ? experience.name : slug;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'מאושר';
      case 'cancelled':
        return 'מבוטל';
      default:
        return 'בהמתנה';
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            הזמנות
          </h1>
          <p className="text-xl text-gray-600">
            כל ההזמנות שהתקבלו באתר
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">אין הזמנות עדיין</h3>
            <p className="text-gray-600 text-lg">ההזמנות שיתקבלו יופיעו כאן</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="sherry-glow hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                        {getExperienceName(booking.experience_slug)}
                      </CardTitle>
                      <Badge className={`${getStatusColor(booking.status)} font-medium`}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      התקבל: {format(new Date(booking.created_date), 'dd/MM/yyyy HH:mm', { locale: he })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 mb-3">פרטי הלקוח</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{booking.customer_name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <a 
                            href={`mailto:${booking.customer_email}`}
                            className="text-amber-600 hover:text-amber-700"
                          >
                            {booking.customer_email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a 
                            href={`tel:${booking.customer_phone}`}
                            className="text-amber-600 hover:text-amber-700"
                          >
                            {booking.customer_phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 mb-3">פרטי ההזמנה</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {format(new Date(booking.preferred_date), 'dd/MM/yyyy', { locale: he })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {booking.number_of_people} משתתפים
                          </span>
                        </div>
                        {booking.special_requests && (
                          <div className="flex items-start space-x-3">
                            <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                              <div className="text-sm text-gray-500 mb-1">בקשות מיוחדות:</div>
                              <p className="text-gray-700">{booking.special_requests}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}