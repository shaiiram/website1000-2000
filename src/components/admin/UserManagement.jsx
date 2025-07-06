import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Booking } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Mail, Shield, Search, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, bookingsData] = await Promise.all([
        User.list('-created_date'),
        Booking.list()
      ]);
      setUsers(usersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserBookings = (userEmail) => {
    return bookings.filter(booking => booking.created_by === userEmail);
  };

  const getUserTotalSpent = (userEmail) => {
    const userBookings = getUserBookings(userEmail).filter(b => b.status === 'confirmed');
    return userBookings.reduce((total, booking) => {
      const price = parseFloat(booking.price?.replace(/[^\d]/g, '') || 0);
      return total + price;
    }, 0);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
        <h2 className="text-2xl font-bold">ניהול משתמשים</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="חפש משתמש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="סנן לפי הרשאה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל ההרשאות</SelectItem>
              <SelectItem value="user">משתמש</SelectItem>
              <SelectItem value="admin">מנהל</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סה"כ משתמשים</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <UserIcon className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">מנהלים</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">לקוחות פעילים</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => getUserBookings(u.email).length > 0).length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => {
          const userBookings = getUserBookings(user.email);
          const totalSpent = getUserTotalSpent(user.email);
          
          return (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.full_name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                      {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      הצטרף: {format(new Date(user.created_date), 'dd/MM/yyyy', { locale: he })}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">{userBookings.length}</div>
                    <p className="text-sm text-gray-600">הזמנות</p>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">₪{totalSpent.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">סה"כ הוצאות</p>
                  </div>
                </div>

                {userBookings.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">הזמנות אחרונות:</h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {userBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{booking.package_name || 'חבילה'}</div>
                          <div className="text-gray-600">
                            {format(new Date(booking.created_date), 'dd/MM/yyyy', { locale: he })}
                          </div>
                          <Badge size="sm" className={
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {booking.status === 'confirmed' ? 'מאושר' :
                             booking.status === 'cancelled' ? 'מבוטל' : 'בהמתנה'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}