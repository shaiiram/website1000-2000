import React, { useState, useEffect } from 'react';
import { Booking } from '@/api/entities';
import { Experience } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, Phone, Mail, MessageSquare, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
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

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await Booking.update(bookingId, { status: newStatus });
      loadData();
    } catch (error) {
      alert('שגיאה בעדכון סטטוס');
    }
  };

  const sendEmail = async () => {
    if (!selectedBooking || !emailSubject || !emailContent) {
      alert('אנא מלא את כל השדות');
      return;
    }

    try {
      await SendEmail({
        to: selectedBooking.customer_email,
        subject: emailSubject,
        body: emailContent
      });
      alert('האימייל נשלח בהצלחה');
      setEmailDialogOpen(false);
      setEmailContent('');
      setEmailSubject('');
    } catch (error) {
      alert('שגיאה בשליחת האימייל');
    }
  };

  const openEmailDialog = (booking) => {
    setSelectedBooking(booking);
    setEmailSubject(`בנוגע להזמנה שלך - ${booking.package_name || getExperienceName(booking.experience_slug)}`);
    setEmailContent(`שלום ${booking.customer_name},\n\nבנוגע להזמנה שלך מתאריך ${format(new Date(booking.created_date), 'dd/MM/yyyy', { locale: he })}.\n\nבברכה,\nצוות 1000-2000`);
    setEmailDialogOpen(true);
  };

  const filteredBookings = bookings.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ניהול הזמנות</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="סנן לפי סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל ההזמנות</SelectItem>
            <SelectItem value="pending">בהמתנה</SelectItem>
            <SelectItem value="confirmed">מאושר</SelectItem>
            <SelectItem value="cancelled">מבוטל</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="sherry-glow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    {booking.package_name || getExperienceName(booking.experience_slug)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                    <Badge variant="outline">
                      הזמנה #{booking.id.slice(-6)}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(booking.created_date), 'dd/MM/yyyy HH:mm', { locale: he })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">פרטי הלקוח</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{booking.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{booking.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{booking.customer_phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">פרטי ההזמנה</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{format(new Date(booking.preferred_date), 'dd/MM/yyyy', { locale: he })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{booking.number_of_people} משתתפים</span>
                    </div>
                    {booking.price && (
                      <div className="font-semibold text-amber-600">
                        {booking.price}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">פעולות</h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        disabled={booking.status === 'confirmed'}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        אשר
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        disabled={booking.status === 'cancelled'}
                      >
                        <X className="w-4 h-4 mr-1" />
                        בטל
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEmailDialog(booking)}
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      שלח אימייל
                    </Button>
                  </div>
                </div>
              </div>
              
              {booking.special_requests && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-sm text-gray-700 mb-1">בקשות מיוחדות:</h5>
                  <p className="text-gray-600">{booking.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>שליחת אימייל ללקוח</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">נושא</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">תוכן ההודעה</label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={8}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={sendEmail} className="flex-1">
                שלח אימייל
              </Button>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)} className="flex-1">
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}