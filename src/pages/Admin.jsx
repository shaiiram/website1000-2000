import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Mail, BarChart3, Settings, Package, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import ExperienceManagement from "../components/admin/ExperienceManagement";
import BookingManagement from "../components/admin/BookingManagement";
import EmailManagement from "../components/admin/EmailManagement";
import Analytics from "../components/admin/Analytics";
import UserManagement from "../components/admin/UserManagement";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser.role !== 'admin') {
          navigate(createPageUrl('Home'));
        }
      } catch (error) {
        navigate(createPageUrl('Home'));
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-amber-500 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">פאנל ניהול</h1>
              <p className="text-lg text-gray-600">ברוך הבא, {user?.full_name}</p>
            </div>
          </div>
        </motion.div>
        
        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>ניהול חוויות</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>ניהול הזמנות</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>מערכת אימיילים</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>אנליטיקות</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>ניהול משתמשים</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experiences">
            <ExperienceManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="emails">
            <EmailManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}