import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, MapPin, Calendar, Users, DollarSign, Star, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SearchFree() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    departure: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: "1",
    children: "0",
    infants: "0",
    hotelRating: "",
    budget: "",
    specialRequests: ""
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchForm(prev => ({
      ...prev,
      destination: urlParams.get('destination') || "",
      adults: urlParams.get('travelers') || "1",
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since this is a "free search", we don't show results but rather
    // lead to a confirmation/thank you page, or in this case, the checkout
    // page with custom details.
    const params = new URLSearchParams({
      packageTitle: `חיפוש מותאם אישית ל${searchForm.destination}`,
      price: "יצירת קשר",
      slug: 'custom-search'
    });
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 mb-8 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>חזרה</span>
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              חיפוש חופשי מתקדם
            </h1>
            <p className="text-xl text-gray-600">
              מלאו את הפרטים ואנחנו נמצא עבורכם את החבילה המושלמת
            </p>
          </div>

          <Card className="sherry-glow">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Search className="w-6 h-6 text-amber-600" />
                חיפוש מתקדם
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 ml-2" />
                      יעד
                    </label>
                    <Input
                      placeholder="לאן תרצו לנסוע?"
                      value={searchForm.destination}
                      onChange={(e) => setSearchForm({...searchForm, destination: e.target.value})}
                      className="w-full"
                    />
                  </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 ml-2" />
                      תאריך יציאה
                    </label>
                    <Input
                      type="date"
                      value={searchForm.departureDate}
                      onChange={(e) => setSearchForm({...searchForm, departureDate: e.target.value})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 ml-2" />
                      תאריך חזרה
                    </label>
                    <Input
                      type="date"
                      value={searchForm.returnDate}
                      onChange={(e) => setSearchForm({...searchForm, returnDate: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Number of travelers */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 ml-2" />
                      מבוגרים
                    </label>
                    <Select 
                      value={searchForm.adults} 
                      onValueChange={(value) => setSearchForm({...searchForm, adults: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="מבוגרים" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 ml-2" />
                      ילדים (2-12)
                    </label>
                    <Select 
                      value={searchForm.children} 
                      onValueChange={(value) => setSearchForm({...searchForm, children: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="ילדים" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0,1,2,3,4,5,6].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Baby className="w-4 h-4 ml-2" />
                      תינוקות (0-2)
                    </label>
                    <Select 
                      value={searchForm.infants} 
                      onValueChange={(value) => setSearchForm({...searchForm, infants: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="תינוקות" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0,1,2,3,4].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Hotel rating and budget */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Star className="w-4 h-4 ml-2" />
                      דרגת מלון מועדפת
                    </label>
                    <Select 
                      value={searchForm.hotelRating} 
                      onValueChange={(value) => setSearchForm({...searchForm, hotelRating: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="בחרו דרגת מלון" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 כוכבים</SelectItem>
                        <SelectItem value="4">4 כוכבים</SelectItem>
                        <SelectItem value="5">5 כוכבים</SelectItem>
                        <SelectItem value="boutique">מלון בוטיק</SelectItem>
                        <SelectItem value="luxury">יוקרה</SelectItem>
                        <SelectItem value="any">לא משנה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 ml-2" />
                      תקציב מקסימלי לאדם
                    </label>
                    <Select 
                      value={searchForm.budget} 
                      onValueChange={(value) => setSearchForm({...searchForm, budget: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="בחרו תקציב" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">עד 1,000 ₪</SelectItem>
                        <SelectItem value="2000">עד 2,000 ₪</SelectItem>
                        <SelectItem value="5000">עד 5,000 ₪</SelectItem>
                        <SelectItem value="10000">עד 10,000 ₪</SelectItem>
                        <SelectItem value="unlimited">ללא הגבלה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Special requests */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    בקשות מיוחדות או הערות
                  </label>
                  <Textarea
                    placeholder="ספרו לנו על העדפות מיוחדות, אילרגיות, חגיגות וכו'..."
                    value={searchForm.specialRequests}
                    onChange={(e) => setSearchForm({...searchForm, specialRequests: e.target.value})}
                    rows={4}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  שלחו בקשת חיפוש
                </Button>

                <p className="text-center text-sm text-gray-500">
                  נחזור אליכם תוך 24 שעות עם הצעות מפורטות ומותאמות אישית
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}