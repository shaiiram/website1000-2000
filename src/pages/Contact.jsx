import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="min-h-screen py-16 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            צרו איתנו קשר
          </h1>
          <p className="text-xl text-gray-600">
            אנחנו כאן לכל שאלה, בקשה או רעיון.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sherry-glow h-full">
              <CardHeader>
                <CardTitle>טופס יצירת קשר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="שם מלא" />
                <Input type="email" placeholder="אימייל" />
                <Textarea placeholder="ההודעה שלך..." rows={5} />
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  שליחה
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Phone className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">טלפון</h3>
                <p className="text-gray-600">050-123-4567</p>
                <p className="text-sm text-gray-500">ימים א'-ה', 9:00-18:00</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">אימייל</h3>
                <p className="text-gray-600">info@1000-2000.co.il</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">משרד</h3>
                <p className="text-gray-600">רחוב דמיוני 123, תל אביב</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}