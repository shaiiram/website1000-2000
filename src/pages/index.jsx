import Layout from "./Layout.jsx";

import Home from "./Home";

import Bookings from "./Bookings";

import ExperienceTransition from "./ExperienceTransition";

import SearchFree from "./SearchFree";

import Admin from "./Admin";

import MyBookings from "./MyBookings";

import Checkout from "./Checkout";

import ExperienceDetails from "./ExperienceDetails";

import Search1000 from "./Search1000";

import Search2000 from "./Search2000";

import Contact from "./Contact";

import Privacy from "./Privacy";

import Accessibility from "./Accessibility";

import Security from "./Security";

import SelectMonth from "./SelectMonth";

import Results from "./Results";

import ThankYou from "./ThankYou";

import Profile from "./Profile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Bookings: Bookings,
    
    ExperienceTransition: ExperienceTransition,
    
    SearchFree: SearchFree,
    
    Admin: Admin,
    
    MyBookings: MyBookings,
    
    Checkout: Checkout,
    
    ExperienceDetails: ExperienceDetails,
    
    Search1000: Search1000,
    
    Search2000: Search2000,
    
    Contact: Contact,
    
    Privacy: Privacy,
    
    Accessibility: Accessibility,
    
    Security: Security,
    
    SelectMonth: SelectMonth,
    
    Results: Results,
    
    ThankYou: ThankYou,
    
    Profile: Profile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Bookings" element={<Bookings />} />
                
                <Route path="/ExperienceTransition" element={<ExperienceTransition />} />
                
                <Route path="/SearchFree" element={<SearchFree />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/MyBookings" element={<MyBookings />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/ExperienceDetails" element={<ExperienceDetails />} />
                
                <Route path="/Search1000" element={<Search1000 />} />
                
                <Route path="/Search2000" element={<Search2000 />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Accessibility" element={<Accessibility />} />
                
                <Route path="/Security" element={<Security />} />
                
                <Route path="/SelectMonth" element={<SelectMonth />} />
                
                <Route path="/Results" element={<Results />} />
                
                <Route path="/ThankYou" element={<ThankYou />} />
                
                <Route path="/Profile" element={<Profile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}