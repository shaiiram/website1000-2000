
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { InvokeLLM } from '@/api/integrations';
import { Experience } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plane, Hotel, Star, Calendar, Clock, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const responseSchema = {
  type: "object",
  properties: {
    packages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          package_name: { type: "string", description: "Catchy name for the package, e.g., 'Romantic Paris Escape'" },
          total_price: { type: "number" },
          flight: {
            type: "object",
            properties: {
              airline: { type: "string" },
              departure_airport: { type: "string", default: "TLV" },
              arrival_airport: { type: "string" },
              departure_date: { type: "string" },
              arrival_date: { type: "string" },
              duration: { type: "string" },
            },
            required: ["airline", "arrival_airport", "departure_date", "arrival_date", "duration"]
          },
          hotel: {
            type: "object",
            properties: {
              name: { type: "string" },
              rating: { type: "number", minimum: 3, maximum: 5 },
              description: { type: "string" },
              image_urls: {
                type: "array",
                items: { type: "string", format: "uri" },
                minItems: 3,
                maxItems: 3
              }
            },
            required: ["name", "rating", "description", "image_urls"]
          }
        },
        required: ["package_name", "total_price", "flight", "hotel"]
      },
      minItems: 6,
      maxItems: 6
    }
  },
  required: ["packages"]
};

const experienceToDestination = {
  "deals-sales": "Europe (e.g., Prague, Budapest)",
  "adventures-safari": "Tanzania or Costa Rica",
  "beaches-diving": "Thailand or the Maldives",
  "accessible-trips": "a major accessible city like Barcelona or London",
  "heritage-trips": "Rome or Athens",
  "spa-wellness": "a countryside resort in Tuscany or a wellness center in Bali",
  "shopping-culinary": "Paris or Milan",
  "cruises": "the Caribbean or the Mediterranean",
  "casino-gaming": "Las Vegas or Macau",
  "winter-sports": "the Swiss Alps or Aspen, Colorado",
  "romance": "Santorini or Venice",
  "business-travel": "a major business hub like New York or London",
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const experienceSlug = urlParams.get('experience');
    const month = urlParams.get('month');
    const budget = urlParams.get('budget');

    if (experienceSlug && month && budget) {
      fetchResults(experienceSlug, month, budget);
    }
  }, [location.search]);

  const fetchResults = async (slug, month, budget) => {
    setLoading(true);
    try {
      const expData = await Experience.filter({ slug: slug });
      if (expData.length > 0) {
        setExperience(expData[0]);
      }
      
      const destination = experienceToDestination[slug] || "a popular tourist destination";
      
      const prompt = `
        Please generate 6 diverse and realistic vacation packages for a trip to ${destination}.
        The vacation should take place in ${month}.
        The budget is up to ${budget} NIS per person. Please ensure prices reflect this budget.
        The package should include round-trip flights from TLV and a hotel stay.
        Generate varied options for airlines and hotels.
        Ensure hotel image URLs are real and from a provider like Unsplash.
        The response MUST strictly follow the provided JSON schema.
      `;
      
      const response = await InvokeLLM({
        prompt: prompt,
        response_json_schema: responseSchema,
        add_context_from_internet: true
      });

      if (response && response.packages) {
        setResults(response.packages);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (pkg) => {
    const params = new URLSearchParams({
        packageTitle: pkg.package_name,
        price: `${pkg.total_price} ₪`,
        slug: experience.slug
    });
    navigate(createPageUrl(`Checkout?${params.toString()}`));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mb-8"></div>
        <h1 className="text-3xl font-bold text-gray-800">רק רגע...</h1>
        <p className="text-xl text-gray-600 mt-2">שרי מחפשת עבורך את החופשות המושלמות ✨</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-center mb-2">מצאנו עבורך מספר הצעות!</h1>
          <p className="text-xl text-center text-gray-600 mb-12">אלו החבילות המומלצות לחווית "{experience?.name}" שלך.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {results.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex flex-col h-full overflow-hidden sherry-glow hover:shadow-2xl transition-all">
                  <div className="grid grid-cols-3 grid-rows-2 h-48">
                      <img src={pkg.hotel.image_urls[0]} className="col-span-2 row-span-2 w-full h-full object-cover"/>
                      <img src={pkg.hotel.image_urls[1]} className="w-full h-full object-cover"/>
                      <img src={pkg.hotel.image_urls[2]} className="w-full h-full object-cover"/>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{pkg.package_name}</CardTitle>
                    <p className="text-2xl font-extrabold text-amber-600">{pkg.total_price} ₪ לאדם</p>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <h4 className="font-bold flex items-center gap-2"><Plane size={18}/> טיסה</h4>
                      <p>{pkg.flight.airline}, {pkg.flight.departure_airport} <ArrowRightLeft size={14}/> {pkg.flight.arrival_airport}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2"><Calendar size={14}/> {pkg.flight.departure_date} - {pkg.flight.arrival_date}</p>
                    </div>
                    <div>
                      <h4 className="font-bold flex items-center gap-2"><Hotel size={18}/> מלון</h4>
                      <p>{pkg.hotel.name}</p>
                      <div className="flex items-center gap-1">{Array(Math.round(pkg.hotel.rating)).fill(0).map((_,i)=><Star key={i} size={16} className="text-yellow-400 fill-yellow-400"/>)}</div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pkg.hotel.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleBooking(pkg)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg">
                      הזמן עכשיו
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
