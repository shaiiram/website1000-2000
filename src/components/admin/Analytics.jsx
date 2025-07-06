import React, { useState, useEffect } from 'react';
import { Booking } from '@/api/entities';
import { Experience } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { he } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Analytics() {
  const [bookings, setBookings] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, experiencesData, usersData] = await Promise.all([
        Booking.list('-created_date'),
        Experience.list(),
        User.list()
      ]);
      setBookings(bookingsData);
      setExperiences(experiencesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const days = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), days);
    return bookings.filter(booking => new Date(booking.created_date) > cutoffDate);
  };

  const getRevenue = () => {
    return getFilteredBookings()
      .filter(booking => booking.status === 'confirmed')
      .reduce((total, booking) => {
        const price = parseFloat(booking.price?.replace(/[^\d]/g, '') || 0);
        return total + price;
      }, 0);
  };

  const getBookingsByStatus = () => {
    const filtered = getFilteredBookings();
    const statusCounts = {
      pending: filtered.filter(b => b.status === 'pending').length,
      confirmed: filtered.filter(b => b.status === 'confirmed').length,
      cancelled: filtered.filter(b => b.status === 'cancelled').length,
    };

    return [
      { name: 'בהמתנה', value: statusCounts.pending, color: '#FFBB28' },
      { name: 'מאושר', value: statusCounts.confirmed, color: '#00C49F' },
      { name: 'מבוטל', value: statusCounts.cancelled, color: '#FF8042' },
    ];
  };

  const getPopularExperiences = () => {
    const filtered = getFilteredBookings();
    const expCounts = {};
    
    filtered.forEach(booking => {
      const expName = experiences.find(exp => exp.slug === booking.experience_slug)?.name || 'לא ידוע';
      expCounts[expName] = (expCounts[expName] || 0) + 1;
    });

    return Object.entries(expCounts)
      .map(([name, count]) => ({ name, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  };

  const getBookingsOverTime = () => {
    const filtered = getFilteredBookings();
    const dailyCounts = {};
    
    filtered.forEach(booking => {
      const date = format(new Date(booking.created_date), 'dd/MM');
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, bookings: count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getAverageBookingValue = () => {
    const confirmedBookings = getFilteredBookings().filter(b => b.status === 'confirmed' && b.price);
    if (confirmedBookings.length === 0) return 0;
    
    const total = confirmedBookings.reduce((sum, booking) => {
      const price = parseFloat(booking.price?.replace(/[^\d]/g, '') || 0);
      return sum + price;
    }, 0);
    
    return Math.round(total / confirmedBookings.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const revenue = getRevenue();
  const filteredBookings = getFilteredBookings();
  const bookingsByStatus = getBookingsByStatus();
  const popularExperiences = getPopularExperiences();
  const bookingsOverTime = getBookingsOverTime();
  const avgBookingValue = getAverageBookingValue();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">אנליטיקות ודוחות</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="בחר טווח זמן" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 ימים אחרונים</SelectItem>
            <SelectItem value="30">30 ימים אחרונים</SelectItem>
            <SelectItem value="90">90 ימים אחרונים</SelectItem>
            <SelectItem value="365">שנה אחרונה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סה"כ הכנסות</p>
                <p className="text-2xl font-bold text-green-600">₪{revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">הזמנות חדשות</p>
                <p className="text-2xl font-bold text-blue-600">{filteredBookings.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">משתמשים רשומים</p>
                <p className="text-2xl font-bold text-purple-600">{users.length}</p>
              </div>
              <Users className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ערך הזמנה ממוצע</p>
                <p className="text-2xl font-bold text-orange-600">₪{avgBookingValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>סטטוס הזמנות</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>חוויות פופולריות</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularExperiences}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>מגמת הזמנות לאורך זמן</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}