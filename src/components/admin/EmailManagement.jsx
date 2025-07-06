
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Booking } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Users, LayoutTemplate, Mail } from 'lucide-react'; // Changed Template to LayoutTemplate
import { motion } from 'framer-motion';

export default function EmailManagement() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customTemplate, setCustomTemplate] = useState({ name: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const emailTemplates = {
    welcome: {
      name: 'ברוכים הבאים',
      subject: 'ברוכים הבאים ל-1000-2000!',
      body: `שלום {name},

ברוכים הבאים לאתר 1000-2000!
אנו שמחים שהצטרפתם אלינו ומחכים לעזור לכם למצוא את החופשה המושלמת.

בברכה,
צוות 1000-2000`
    },
    booking_confirmed: {
      name: 'אישור הזמנה',
      subject: 'הזמנתכם אושרה!',
      body: `שלום {name},

הזמנתכם לחופשה אושרה בהצלחה!
פרטי ההזמנה:
- תאריך: {date}
- מספר משתתפים: {people}

נחזור אליכם בהקדם עם פרטים נוספים.

בברכה,
צוות 1000-2000`
    },
    special_offer: {
      name: 'הצעה מיוחדת',
      subject: 'הצעה מיוחדת רק עבורך!',
      body: `שלום {name},

יש לנו הצעה מיוחדת רק עבורך!
מבצע זמן מוגבל על חבילות נופש נבחרות.

לפרטים נוספים, אנא צרו איתנו קשר.

בברכה,
צוות 1000-2000`
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, bookingsData] = await Promise.all([
        User.list(),
        Booking.list('-created_date', 50)
      ]);
      setUsers(usersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const sendSingleEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      alert('אנא מלא את כל השדות');
      return;
    }

    setSending(true);
    try {
      await SendEmail({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body
      });
      alert('האימייל נשלח בהצלחה');
      setEmailData({ to: '', subject: '', body: '' });
    } catch (error) {
      alert('שגיאה בשליחת האימייל');
    } finally {
      setSending(false);
    }
  };

  const sendBulkEmail = async () => {
    if (!emailData.subject || !emailData.body) {
      alert('אנא מלא את נושא וגוף ההודעה');
      return;
    }

    const confirmed = confirm(`האם אתה בטוח שברצונך לשלוח אימייל ל-${users.length} משתמשים?`);
    if (!confirmed) return;

    setSending(true);
    try {
      for (const user of users) {
        const personalizedBody = emailData.body
          .replace(/{name}/g, user.full_name)
          .replace(/{email}/g, user.email);
        
        await SendEmail({
          to: user.email,
          subject: emailData.subject,
          body: personalizedBody
        });
      }
      alert(`נשלחו ${users.length} אימיילים בהצלחה`);
      setEmailData({ to: '', subject: '', body: '' });
    } catch (error) {
      alert('שגיאה בשליחת אימיילים');
    } finally {
      setSending(false);
    }
  };

  const loadTemplate = (templateKey) => {
    const template = emailTemplates[templateKey];
    if (template) {
      setEmailData({
        to: emailData.to,
        subject: template.subject,
        body: template.body
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-6">מערכת אימיילים</h2>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">אימייל יחיד</TabsTrigger>
          <TabsTrigger value="bulk">שליחה המונית</TabsTrigger>
          <TabsTrigger value="templates">תבניות</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                שליחת אימייל יחיד
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">נמען</label>
                <Input
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="example@email.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">נושא</label>
                <Input
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="נושא האימייל"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">תוכן ההודעה</label>
                <Textarea
                  value={emailData.body}
                  onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
                  rows={8}
                  placeholder="כתוב את תוכן ההודעה כאן..."
                />
              </div>
              <Button onClick={sendSingleEmail} disabled={sending} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'שולח...' : 'שלח אימייל'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                שליחה המונית ({users.length} משתמשים)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ניתן להשתמש במשתנים: {'{name}'} לשם המשתמש, {'{email}'} לאימייל
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">נושא</label>
                <Input
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="נושא האימייל"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">תוכן ההודעה</label>
                <Textarea
                  value={emailData.body}
                  onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
                  rows={8}
                  placeholder="שלום {name}, ..."
                />
              </div>
              <Button onClick={sendBulkEmail} disabled={sending} className="w-full bg-orange-600 hover:bg-orange-700">
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'שולח...' : `שלח ל-${users.length} משתמשים`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5" /> {/* Changed Template to LayoutTemplate */}
                  תבניות מוכנות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                    <Button size="sm" onClick={() => loadTemplate(key)} className="w-full">
                      השתמש בתבנית
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>סטטיסטיקות אימיילים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-sm text-gray-600">משתמשים רשומים</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{bookings.length}</div>
                    <div className="text-sm text-gray-600">הזמנות סה"כ</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">הזמנות אחרונות</h4>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{booking.customer_name}</span>
                        <Badge className="text-xs">{booking.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
