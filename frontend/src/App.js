import React, { useState, createContext, useContext, useEffect } from 'react';
import './App.css';

// Create contexts for state management
const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

// Mock data
const mockVenues = [
  {
    id: 1,
    name: "Elite Tennis Club",
    sportTypes: ["Tennis"],
    startingPrice: 50,
    rating: 4.8,
    address: "123 Sports Ave, City Center",
    description: "Premium tennis facility with 6 professional courts, pro shop, and coaching services.",
    amenities: ["Parking", "Lockers", "Pro Shop", "Coaching", "Restrooms"],
    images: [
      "https://images.unsplash.com/photo-1448743133657-f67644da3008?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydHxlbnwwfHx8fDE3NTQ5MDAxMTJ8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1499510318569-1a3d67dc3976?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHx0ZW5uaXMlMjBjb3VydHxlbnwwfHx8fDE3NTQ5MDAxMTJ8MA&ixlib=rb-4.1.0&q=85"
    ],
    courts: [
      { id: 1, name: "Court 1", sportType: "Tennis", pricePerHour: 50 },
      { id: 2, name: "Court 2", sportType: "Tennis", pricePerHour: 55 }
    ],
    reviews: [
      { id: 1, user: "John Smith", rating: 5, comment: "Excellent facilities and well-maintained courts!" },
      { id: 2, user: "Sarah Johnson", rating: 4, comment: "Great place, professional staff." }
    ],
    status: "approved"
  },
  {
    id: 2,
    name: "City Basketball Center",
    sportTypes: ["Basketball"],
    startingPrice: 40,
    rating: 4.6,
    address: "456 Athletic Blvd, Downtown",
    description: "Indoor basketball facility with 4 full courts and modern amenities.",
    amenities: ["Parking", "Lockers", "Scoreboard", "Sound System", "AC"],
    images: [
      "https://images.unsplash.com/photo-1751010942953-e48cb4b2ccf5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxzcG9ydHMlMjBjb3VydHN8ZW58MHx8fHwxNzU0OTAwMTA1fDA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1749743823062-df9d9de55e94?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxzcG9ydHMlMjBjb3VydHN8ZW58MHx8fHwxNzU0OTAwMTA1fDA&ixlib=rb-4.1.0&q=85"
    ],
    courts: [
      { id: 3, name: "Court A", sportType: "Basketball", pricePerHour: 40 },
      { id: 4, name: "Court B", sportType: "Basketball", pricePerHour: 45 }
    ],
    reviews: [
      { id: 3, user: "Mike Davis", rating: 5, comment: "Perfect for team practice!" }
    ],
    status: "approved"
  },
  {
    id: 3,
    name: "Premier Sports Complex",
    sportTypes: ["Tennis", "Basketball", "Badminton"],
    startingPrice: 35,
    rating: 4.7,
    address: "789 Champions Way, Sports District",
    description: "Multi-sport facility offering various court types for all skill levels.",
    amenities: ["Parking", "Cafe", "Lockers", "Equipment Rental", "Shower"],
    images: [
      "https://images.pexels.com/photos/3067481/pexels-photo-3067481.jpeg",
      "https://images.pexels.com/photos/7648145/pexels-photo-7648145.jpeg"
    ],
    courts: [
      { id: 5, name: "Tennis Court 1", sportType: "Tennis", pricePerHour: 45 },
      { id: 6, name: "Basketball Court", sportType: "Basketball", pricePerHour: 35 },
      { id: 7, name: "Badminton Court 1", sportType: "Badminton", pricePerHour: 30 }
    ],
    reviews: [],
    status: "pending"
  }
];

const mockUsers = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "user", status: "active" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "user", status: "active" },
  { id: 3, name: "Mike Davis", email: "mike@example.com", role: "facility_owner", status: "active" },
  { id: 4, name: "Admin User", email: "admin@quickcourt.com", role: "admin", status: "active" }
];

const mockBookings = [
  {
    id: 1,
    userId: 1,
    venueId: 1,
    venueName: "Elite Tennis Club",
    courtId: 1,
    courtName: "Court 1",
    sportType: "Tennis",
    date: "2025-01-20",
    time: "10:00",
    duration: 2,
    totalPrice: 100,
    status: "confirmed"
  },
  {
    id: 2,
    userId: 1,
    venueId: 2,
    venueName: "City Basketball Center",
    courtId: 3,
    courtName: "Court A",
    sportType: "Basketball",
    date: "2025-01-25",
    time: "14:00",
    duration: 1,
    totalPrice: 40,
    status: "confirmed"
  }
];

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage, currentUser, setCurrentUser }) => {
  const { role } = currentUser || {};

  const handleRoleSwitch = (newRole) => {
    const user = mockUsers.find(u => u.role === newRole);
    setCurrentUser(user);
    if (newRole === 'user') setCurrentPage('home');
    else if (newRole === 'facility_owner') setCurrentPage('owner-dashboard');
    else if (newRole === 'admin') setCurrentPage('admin-dashboard');
  };

  return (
    <nav className="nav-enhanced">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1M21 3H3l1.5 1M21 3l-1.5 1" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">QuickCourt</h1>
            </div>
          </div>
          
          {/* Role Switch */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 font-medium">View as:</span>
              <select 
                value={role || 'user'} 
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">End User</option>
                <option value="facility_owner">Facility Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {role === 'user' && (
                <>
                  <button onClick={() => setCurrentPage('home')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Home</button>
                  <button onClick={() => setCurrentPage('venues')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'venues' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Venues</button>
                  <button onClick={() => setCurrentPage('my-bookings')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'my-bookings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>My Bookings</button>
                  <button onClick={() => setCurrentPage('profile')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Profile</button>
                </>
              )}
              {role === 'facility_owner' && (
                <>
                  <button onClick={() => setCurrentPage('owner-dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'owner-dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Dashboard</button>
                  <button onClick={() => setCurrentPage('facility-management')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'facility-management' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Facilities</button>
                  <button onClick={() => setCurrentPage('court-management')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'court-management' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Courts</button>
                  <button onClick={() => setCurrentPage('time-slot-management')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'time-slot-management' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Time Slots</button>
                  <button onClick={() => setCurrentPage('booking-overview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'booking-overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Bookings</button>
                </>
              )}
              {role === 'admin' && (
                <>
                  <button onClick={() => setCurrentPage('admin-dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'admin-dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Dashboard</button>
                  <button onClick={() => setCurrentPage('facility-approval')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'facility-approval' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Facility Approval</button>
                  <button onClick={() => setCurrentPage('user-management')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'user-management' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Users</button>
                  <button onClick={() => setCurrentPage('reports-moderation')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === 'reports-moderation' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Reports</button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = ({ setCurrentPage, setSelectedVenue }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const popularVenues = mockVenues.filter(v => v.status === 'approved').slice(0, 6);
  const popularSports = [
    { name: "Tennis", venues: 15, icon: "🎾" },
    { name: "Basketball", venues: 12, icon: "🏀" },
    { name: "Badminton", venues: 8, icon: "🏸" },
    { name: "Football", venues: 6, icon: "⚽" },
    { name: "Swimming", venues: 4, icon: "🏊" },
    { name: "Volleyball", venues: 3, icon: "🏐" }
  ];

  const locations = ["All Locations", "City Center", "Downtown", "Sports District", "North Side", "South Side"];
  
  const featuredStats = [
    { label: "Active Venues", value: "150+" },
    { label: "Sports Available", value: "25+" },
    { label: "Happy Members", value: "10K+" },
    { label: "Cities Covered", value: "15+" }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentPage('venues');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative hero-enhanced min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578966663421-00f3bfebfa89?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHx0ZW5uaXMlMjBjb3VydHxlbnwwfHx8fDE3NTQ5MDQ2MjV8MA&ixlib=rb-4.1.0&q=85')`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Book Premium Sports Venues
            <span className="block text-blue-300 text-4xl md:text-5xl mt-2">
              Instantly & Effortlessly
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
            Discover and reserve the best sports facilities in your city. From tennis courts to basketball arenas, find your perfect venue in seconds.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-2 shadow-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search venues, sports, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-enhanced w-full border-0 focus:ring-0"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="search-enhanced w-full border-0 focus:ring-0"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <button 
                  onClick={handleSearch}
                  className="btn-primary-enhanced w-full h-full text-lg font-semibold"
                >
                  Search Venues
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {featuredStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Venues Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Venues</h2>
            <p className="text-xl text-gray-600">Top-rated facilities trusted by thousands of athletes</p>
          </div>
          <button 
            onClick={() => setCurrentPage('venues')}
            className="btn-secondary-enhanced"
          >
            View All Venues
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularVenues.map(venue => (
            <div key={venue.id} className="card-enhanced overflow-hidden">
              <div className="relative h-56">
                <img 
                  src={venue.images[0]} 
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {venue.rating}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex flex-wrap gap-1">
                    {venue.sportTypes.slice(0, 2).map(sport => (
                      <span key={sport} className="bg-blue-600 bg-opacity-90 text-white px-2 py-1 rounded-md text-xs font-medium">
                        {sport}
                      </span>
                    ))}
                    {venue.sportTypes.length > 2 && (
                      <span className="bg-gray-600 bg-opacity-90 text-white px-2 py-1 rounded-md text-xs font-medium">
                        +{venue.sportTypes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {venue.address}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-blue-600">
                      From ${venue.startingPrice}/hr
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1M21 3H3l1.5 1M21 3l-1.5 1" />
                    </svg>
                    {venue.courts.length} courts
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedVenue(venue);
                    setCurrentPage('venue-detail');
                  }}
                  className="btn-primary-enhanced w-full"
                >
                  View Details & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Sports Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Sports Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find the perfect facility for your favorite sport. From amateur to professional level.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularSports.map(sport => (
              <button 
                key={sport.name}
                onClick={() => setCurrentPage('venues')}
                className="card-enhanced p-6 text-center hover:border-blue-200 transition-all duration-200"
              >
                <div className="text-4xl mb-3">{sport.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{sport.name}</h3>
                <p className="text-sm text-gray-500">{sport.venues} venues</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How QuickCourt Works</h2>
          <p className="text-xl text-gray-600">Simple, fast, and secure venue booking in three easy steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Search & Browse",
              description: "Find venues near you using our advanced search filters. Compare prices, amenities, and availability.",
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )
            },
            {
              step: "02", 
              title: "Book Instantly",
              description: "Select your preferred time slot and court. Our secure booking system confirms your reservation immediately.",
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              step: "03",
              title: "Play & Enjoy",
              description: "Show up at your venue with your booking confirmation. Enjoy premium facilities and excellent service.",
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 000-3H9v3zm3.5-3a1.5 1.5 0 000 3H10V7h2.5z" />
                </svg>
              )
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{item.step}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Book Your Next Game?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of athletes who trust QuickCourt for their venue bookings</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setCurrentPage('venues')}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Venues
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Venues Page Component
const VenuesPage = ({ setCurrentPage, setSelectedVenue }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  const approvedVenues = mockVenues.filter(v => v.status === 'approved');
  
  // Filter venues
  const filteredVenues = approvedVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = !selectedSport || venue.sportTypes.includes(selectedSport);
    const matchesPrice = !priceRange || 
      (priceRange === 'low' && venue.startingPrice < 40) ||
      (priceRange === 'medium' && venue.startingPrice >= 40 && venue.startingPrice < 60) ||
      (priceRange === 'high' && venue.startingPrice >= 60);
    
    return matchesSearch && matchesSport && matchesPrice;
  });

  // Sort venues
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.startingPrice - b.startingPrice;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedVenues.length / itemsPerPage);
  const startIndex = (currentPageNum - 1) * itemsPerPage;
  const paginatedVenues = sortedVenues.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Venue</h1>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search venues or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sports</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Football">Football</option>
                </select>
              </div>
              <div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Prices</option>
                  <option value="low">Under $40</option>
                  <option value="medium">$40 - $59</option>
                  <option value="high">$60+</option>
                </select>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">{filteredVenues.length} venues found</p>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedVenues.map(venue => (
            <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <img 
                src={venue.images[0]} 
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-1">{venue.sportTypes.join(', ')}</p>
                <p className="text-gray-500 text-sm mb-3">{venue.address}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">${venue.startingPrice}/hr</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{venue.rating}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedVenue(venue);
                    setCurrentPage('venue-detail');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                disabled={currentPageNum === 1}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPageNum(i + 1)}
                  className={`px-3 py-2 border rounded-md ${
                    currentPageNum === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                disabled={currentPageNum === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Venue Detail Page Component
const VenueDetailPage = ({ venue, setCurrentPage, setSelectedCourt }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleBookNow = (court) => {
    setSelectedCourt(court);
    setCurrentPage('court-booking');
  };

  const handleSubmitReview = () => {
    // In real app, this would submit to backend
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '' });
    alert('Review submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('venues')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Venues
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img
                src={venue.images[currentImageIndex]}
                alt={venue.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {venue.images.length > 1 && (
              <div className="flex space-x-2">
                {venue.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${venue.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="ml-1 text-lg">{venue.rating}</span>
                <span className="ml-2 text-gray-500">({venue.reviews.length} reviews)</span>
              </div>
              <p className="text-gray-600 mb-4">{venue.address}</p>
              <p className="text-gray-700 mb-6">{venue.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sports Available</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sportTypes.map(sport => (
                    <span key={sport} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {venue.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  From ${venue.startingPrice}/hr
                </div>
                <button 
                  onClick={() => handleBookNow(venue.courts[0])}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Courts Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.courts.map(court => (
              <div key={court.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">{court.name}</h3>
                <p className="text-gray-600 mb-2">{court.sportType}</p>
                <div className="text-2xl font-bold text-blue-600 mb-4">${court.pricePerHour}/hr</div>
                <button 
                  onClick={() => handleBookNow(court)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Book This Court
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  {[5,4,3,2,1].map(num => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleSubmitReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Submit Review
                </button>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {venue.reviews.length > 0 ? (
              venue.reviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium">{review.user}</span>
                    <div className="ml-2 flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Court Booking Page Component
const CourtBookingPage = ({ court, venue, setCurrentPage, bookings, setBookings }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  useEffect(() => {
    if (court) {
      setTotalPrice(court.pricePerHour * duration);
    }
  }, [court, duration]);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    const newBooking = {
      id: Math.max(...bookings.map(b => b.id), 0) + 1,
      userId: 1, // Current user
      venueId: venue.id,
      venueName: venue.name,
      courtId: court.id,
      courtName: court.name,
      sportType: court.sportType,
      date: selectedDate,
      time: selectedTime,
      duration,
      totalPrice,
      status: 'confirmed'
    };

    setBookings([...bookings, newBooking]);
    alert('Booking confirmed! Redirecting to payment...');
    setTimeout(() => {
      setCurrentPage('my-bookings');
    }, 1500);
  };

  if (!court || !venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No court selected</p>
          <button 
            onClick={() => setCurrentPage('venues')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Browse Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('venue-detail')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Venue Details
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Court</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Court Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold">{venue.name}</h3>
                  <p className="text-gray-600">{court.name} - {court.sportType}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">${court.pricePerHour}/hour</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4].map(hour => (
                      <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Court:</span>
                    <span className="font-medium">{court.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sport:</span>
                    <span className="font-medium">{court.sportType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{selectedTime || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium">${court.pricePerHour}/hour</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${totalPrice}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Proceed to Payment
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By booking, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// My Bookings Page Component  
const MyBookingsPage = ({ bookings, setBookings }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const bookingDate = new Date(booking.date);
      return bookingDate >= new Date() && booking.status === 'confirmed';
    }
    if (filter === 'past') {
      const bookingDate = new Date(booking.date);
      return bookingDate < new Date() || booking.status === 'completed';
    }
    return booking.status === filter;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'venue') {
      return a.venueName.localeCompare(b.venueName);
    }
    return 0;
  });

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="venue">Sort by Venue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {sortedBookings.length > 0 ? (
            sortedBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.venueName}</h3>
                        <p className="text-gray-600">{booking.courtName}</p>
                        <p className="text-sm text-gray-500">{booking.sportType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">{booking.date}</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration & Price</p>
                        <p className="font-medium">{booking.duration} hour{booking.duration > 1 ? 's' : ''}</p>
                        <p className="font-bold text-blue-600">${booking.totalPrice}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.status === 'confirmed' && new Date(booking.date) > new Date() && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">You haven't made any bookings yet</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'venues' }))}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Browse Venues
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Page Component
const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });

  const handleSave = () => {
    setCurrentUser({ ...currentUser, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentUser?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentUser?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p className="text-gray-900 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300 mr-2"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'my-bookings' }))}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-300"
                >
                  <div className="font-medium">My Bookings</div>
                  <div className="text-sm text-gray-600">View and manage your bookings</div>
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'venues' }))}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-300"
                >
                  <div className="font-medium">Browse Venues</div>
                  <div className="text-sm text-gray-600">Find new places to play</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Owner Dashboard Component
const OwnerDashboard = () => {
  const kpis = {
    totalBookings: 156,
    activeCourts: 8,
    monthlyEarnings: 12450,
    occupancyRate: 78
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const bookingData = [
    { day: 'Mon', bookings: 12, revenue: 480 },
    { day: 'Tue', bookings: 8, revenue: 320 },
    { day: 'Wed', bookings: 15, revenue: 600 },
    { day: 'Thu', bookings: 10, revenue: 400 },
    { day: 'Fri', bookings: 18, revenue: 720 },
    { day: 'Sat', bookings: 22, revenue: 880 },
    { day: 'Sun', bookings: 16, revenue: 640 }
  ];

  const peakHours = [
    { hour: '8AM', bookings: 5 },
    { hour: '10AM', bookings: 8 },
    { hour: '12PM', bookings: 12 },
    { hour: '2PM', bookings: 15 },
    { hour: '4PM', bookings: 20 },
    { hour: '6PM', bookings: 25 },
    { hour: '8PM', bookings: 18 }
  ];

  const recentBookings = [
    { id: 1, user: 'John Smith', court: 'Tennis Court 1', time: '10:00', amount: 50 },
    { id: 2, user: 'Sarah Johnson', court: 'Basketball Court', time: '14:00', amount: 40 },
    { id: 3, user: 'Mike Davis', court: 'Tennis Court 2', time: '16:00', amount: 55 },
    { id: 4, user: 'Emily Brown', court: 'Badminton Court', time: '18:00', amount: 30 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Facility Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome back! Here's how your facilities are performing today.</p>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-enhanced p-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.totalBookings}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-enhanced p-6 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Active Courts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.activeCourts}</p>
                <div className="mt-2">
                  <span className="text-sm text-green-600 font-medium">All operational</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1M21 3H3l1.5 1M21 3l-1.5 1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-enhanced p-6 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${kpis.monthlyEarnings.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+8% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-enhanced p-6 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.occupancyRate}%</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+5% from last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Booking Trends */}
          <div className="chart-enhanced">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Performance</h2>
            <div className="space-y-4">
              {bookingData.map(data => (
                <div key={data.day} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.day}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Bookings</span>
                      <span className="text-xs font-medium text-gray-900">{data.bookings}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${(data.bookings / 25) * 100}%`}}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Revenue</span>
                      <span className="text-xs font-medium text-green-600">${data.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours Analysis */}
          <div className="chart-enhanced">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Peak Booking Hours</h2>
            <div className="space-y-4">
              {peakHours.map(data => (
                <div key={data.hour} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.hour}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mx-4">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                      style={{width: `${(data.bookings / 25) * 100}%`}}
                    ></div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{data.bookings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Calendar */}
          <div className="card-enhanced p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Schedule</h2>
            <div className="table-enhanced">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Court 1</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Court 2</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Court 3</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.slice(0, 6).map(time => (
                    <tr key={time} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{time}</td>
                      <td className="py-3 px-4">
                        {Math.random() > 0.5 ? (
                          <span className="status-badge-enhanced bg-green-100 text-green-800">
                            Booked
                          </span>
                        ) : (
                          <span className="status-badge-enhanced bg-gray-100 text-gray-600">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {Math.random() > 0.5 ? (
                          <span className="status-badge-enhanced bg-green-100 text-green-800">
                            Booked
                          </span>
                        ) : (
                          <span className="status-badge-enhanced bg-gray-100 text-gray-600">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {Math.random() > 0.5 ? (
                          <span className="status-badge-enhanced bg-green-100 text-green-800">
                            Booked
                          </span>
                        ) : (
                          <span className="status-badge-enhanced bg-gray-100 text-gray-600">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card-enhanced p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Bookings</h2>
            <div className="space-y-4">
              {recentBookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {booking.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{booking.user}</h4>
                      <p className="text-sm text-gray-600">{booking.court} • {booking.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">${booking.amount}</div>
                    <div className="text-xs text-gray-500">1 hour</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Facility Management Page Component
const FacilityManagementPage = ({ venues, setVenues }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    sportTypes: [],
    amenities: [],
    images: []
  });

  const ownerVenues = venues.filter(v => v.status === 'approved' || v.status === 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVenue = {
      id: Math.max(...venues.map(v => v.id), 0) + 1,
      ...formData,
      startingPrice: 50,
      rating: 0,
      courts: [],
      reviews: [],
      status: 'pending'
    };

    if (editingFacility) {
      setVenues(venues.map(v => v.id === editingFacility.id ? { ...v, ...formData } : v));
      setEditingFacility(null);
    } else {
      setVenues([...venues, newVenue]);
    }

    setShowAddForm(false);
    setFormData({ name: '', address: '', description: '', sportTypes: [], amenities: [], images: [] });
    alert(editingFacility ? 'Facility updated!' : 'Facility added for approval!');
  };

  const handleEdit = (venue) => {
    setEditingFacility(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      description: venue.description,
      sportTypes: venue.sportTypes,
      amenities: venue.amenities,
      images: venue.images
    });
    setShowAddForm(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facility Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Add New Facility
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sports Available</label>
                  <div className="flex flex-wrap gap-2">
                    {['Tennis', 'Basketball', 'Badminton', 'Football', 'Swimming'].map(sport => (
                      <label key={sport} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.sportTypes.includes(sport)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, sportTypes: [...formData.sportTypes, sport]});
                            } else {
                              setFormData({...formData, sportTypes: formData.sportTypes.filter(s => s !== sport)});
                            }
                          }}
                          className="mr-2"
                        />
                        {sport}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {['Parking', 'Lockers', 'Restrooms', 'Cafe', 'Pro Shop', 'AC', 'Shower'].map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, amenities: [...formData.amenities, amenity]});
                            } else {
                              setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                            }
                          }}
                          className="mr-2"
                        />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {formData.images.map((img, index) => (
                        <img key={index} src={img} alt={`Upload ${index + 1}`} className="w-full h-16 object-cover rounded" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingFacility(null);
                      setFormData({ name: '', address: '', description: '', sportTypes: [], amenities: [], images: [] });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    {editingFacility ? 'Update' : 'Add'} Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Facilities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerVenues.map(venue => (
            <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={venue.images[0] || 'https://via.placeholder.com/300x200'} 
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{venue.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    venue.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venue.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{venue.address}</p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{venue.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">{venue.courts.length} courts</span>
                  <button
                    onClick={() => handleEdit(venue)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Court Management Page Component
const CourtManagementPage = ({ venues, setVenues }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    operatingHours: { start: '08:00', end: '22:00' }
  });

  const ownerVenues = venues.filter(v => v.status === 'approved');
  const allCourts = ownerVenues.flatMap(venue => 
    venue.courts.map(court => ({ ...court, venueName: venue.name, venueId: venue.id }))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const venueId = parseInt(selectedVenue);
    const venue = venues.find(v => v.id === venueId);
    
    if (!venue) return;

    const newCourt = {
      id: Math.max(...allCourts.map(c => c.id), 0) + 1,
      name: formData.name,
      sportType: formData.sportType,
      pricePerHour: parseInt(formData.pricePerHour),
      operatingHours: formData.operatingHours
    };

    if (editingCourt) {
      const updatedVenues = venues.map(v => {
        if (v.id === venueId) {
          return {
            ...v,
            courts: v.courts.map(c => c.id === editingCourt.id ? { ...c, ...newCourt, id: editingCourt.id } : c)
          };
        }
        return v;
      });
      setVenues(updatedVenues);
      setEditingCourt(null);
    } else {
      const updatedVenues = venues.map(v => {
        if (v.id === venueId) {
          return { ...v, courts: [...v.courts, newCourt] };
        }
        return v;
      });
      setVenues(updatedVenues);
    }

    setShowAddForm(false);
    setFormData({ name: '', sportType: '', pricePerHour: '', operatingHours: { start: '08:00', end: '22:00' } });
    setSelectedVenue('');
    alert(editingCourt ? 'Court updated!' : 'Court added!');
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setSelectedVenue(court.venueId.toString());
    setFormData({
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour.toString(),
      operatingHours: court.operatingHours || { start: '08:00', end: '22:00' }
    });
    setShowAddForm(true);
  };

  const handleDelete = (court) => {
    if (window.confirm('Are you sure you want to delete this court?')) {
      const updatedVenues = venues.map(v => {
        if (v.id === court.venueId) {
          return { ...v, courts: v.courts.filter(c => c.id !== court.id) };
        }
        return v;
      });
      setVenues(updatedVenues);
      alert('Court deleted!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Court Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Add New Court
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCourt ? 'Edit Court' : 'Add New Court'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Venue</label>
                    <select
                      value={selectedVenue}
                      onChange={(e) => setSelectedVenue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Choose a venue</option>
                      {ownerVenues.map(venue => (
                        <option key={venue.id} value={venue.id}>{venue.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Court Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type</label>
                    <select
                      value={formData.sportType}
                      onChange={(e) => setFormData({...formData, sportType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select sport</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Football">Football</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour ($)</label>
                    <input
                      type="number"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                      min="1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                      <input
                        type="time"
                        value={formData.operatingHours.start}
                        onChange={(e) => setFormData({
                          ...formData, 
                          operatingHours: {...formData.operatingHours, start: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                      <input
                        type="time"
                        value={formData.operatingHours.end}
                        onChange={(e) => setFormData({
                          ...formData, 
                          operatingHours: {...formData.operatingHours, end: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCourt(null);
                      setFormData({ name: '', sportType: '', pricePerHour: '', operatingHours: { start: '08:00', end: '22:00' } });
                      setSelectedVenue('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    {editingCourt ? 'Update' : 'Add'} Court
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Hour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allCourts.map(court => (
                <tr key={court.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{court.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{court.venueName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{court.sportType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${court.pricePerHour}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {court.operatingHours?.start || '08:00'} - {court.operatingHours?.end || '22:00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(court)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(court)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Time Slot Management Page Component
const TimeSlotManagementPage = ({ venues }) => {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [maintenanceReason, setMaintenanceReason] = useState('');

  const ownerVenues = venues.filter(v => v.status === 'approved');
  const selectedVenueData = ownerVenues.find(v => v.id === parseInt(selectedVenue));
  const availableCourts = selectedVenueData?.courts || [];
  const selectedCourtData = availableCourts.find(c => c.id === parseInt(selectedCourt));

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const handleSlotToggle = (time) => {
    const slotKey = `${selectedVenue}-${selectedCourt}-${selectedDate}-${time}`;
    if (blockedSlots.includes(slotKey)) {
      setBlockedSlots(blockedSlots.filter(slot => slot !== slotKey));
    } else {
      setBlockedSlots([...blockedSlots, slotKey]);
    }
  };

  const isSlotBlocked = (time) => {
    const slotKey = `${selectedVenue}-${selectedCourt}-${selectedDate}-${time}`;
    return blockedSlots.includes(slotKey);
  };

  const handleBulkBlock = () => {
    if (!selectedVenue || !selectedCourt || !maintenanceReason) {
      alert('Please select venue, court and provide maintenance reason');
      return;
    }
    
    const confirmed = window.confirm(`Block all remaining time slots for ${selectedCourtData?.name} on ${selectedDate} for: ${maintenanceReason}?`);
    if (confirmed) {
      const newBlockedSlots = timeSlots.map(time => 
        `${selectedVenue}-${selectedCourt}-${selectedDate}-${time}`
      );
      setBlockedSlots([...new Set([...blockedSlots, ...newBlockedSlots])]);
      alert('Time slots blocked for maintenance!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Time Slot Management</h1>

        {/* Selection Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Venue</label>
              <select
                value={selectedVenue}
                onChange={(e) => {
                  setSelectedVenue(e.target.value);
                  setSelectedCourt('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a venue</option>
                {ownerVenues.map(venue => (
                  <option key={venue.id} value={venue.id}>{venue.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Court</label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!selectedVenue}
              >
                <option value="">Choose a court</option>
                {availableCourts.map(court => (
                  <option key={court.id} value={court.id}>{court.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Reason</label>
              <input
                type="text"
                value={maintenanceReason}
                onChange={(e) => setMaintenanceReason(e.target.value)}
                placeholder="e.g., Court cleaning"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleBulkBlock}
              disabled={!selectedVenue || !selectedCourt || !maintenanceReason}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Block All Remaining Slots
            </button>
          </div>
        </div>

        {/* Time Slot Grid */}
        {selectedCourt && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Manage Availability - {selectedCourtData?.name} on {selectedDate}
            </h2>
            <p className="text-gray-600 mb-6">Click on time slots to toggle availability. Red = Blocked, Green = Available</p>
            
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => handleSlotToggle(time)}
                  className={`p-4 rounded-lg font-medium transition duration-300 ${
                    isSlotBlocked(time)
                      ? 'bg-red-100 text-red-800 border-2 border-red-300'
                      : 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200'
                  }`}
                >
                  <div className="text-sm font-medium">{time}</div>
                  <div className="text-xs mt-1">
                    {isSlotBlocked(time) ? 'Blocked' : 'Available'}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Legend:</h3>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-200 border border-green-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Available for booking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-200 border border-red-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Blocked for maintenance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Booking Overview Page Component
const BookingOverviewPage = ({ bookings, venues }) => {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const ownerVenues = venues.filter(v => v.status === 'approved');
  const ownerVenueIds = ownerVenues.map(v => v.id);
  const ownerBookings = bookings.filter(booking => ownerVenueIds.includes(booking.venueId));

  const filteredBookings = ownerBookings.filter(booking => {
    const matchesStatus = filter === 'all' || booking.status === filter;
    const matchesDate = !dateFilter || booking.date === dateFilter;
    return matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Overview</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilter('all');
                  setDateFilter('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{ownerBookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {ownerBookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-gray-600">
              {ownerBookings.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {ownerBookings.filter(b => b.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    User #{booking.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.venueName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.courtName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.date} at {booking.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.duration} hour{booking.duration > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">No bookings match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ venues, users, bookings }) => {
  const kpis = {
    totalUsers: users.filter(u => u.role === 'user').length,
    totalFacilityOwners: users.filter(u => u.role === 'facility_owner').length,
    totalBookings: bookings.length,
    totalActiveCourts: venues.reduce((total, venue) => total + venue.courts.length, 0)
  };

  const bookingTrends = [
    { month: 'Jan', bookings: 45, users: 12 },
    { month: 'Feb', bookings: 52, users: 18 },
    { month: 'Mar', bookings: 48, users: 15 },
    { month: 'Apr', bookings: 61, users: 22 },
    { month: 'May', bookings: 58, users: 19 },
    { month: 'Jun', bookings: 67, users: 25 }
  ];

  const userRegistrations = [
    { month: 'Jan', users: 12, growth: 15 },
    { month: 'Feb', users: 18, growth: 22 },
    { month: 'Mar', users: 15, growth: 8 },
    { month: 'Apr', users: 22, growth: 28 },
    { month: 'May', users: 19, growth: 12 },
    { month: 'Jun', users: 25, growth: 18 }
  ];

  const facilityApprovals = [
    { month: 'Jan', approved: 3, rejected: 1, pending: 2 },
    { month: 'Feb', approved: 5, rejected: 2, pending: 1 },
    { month: 'Mar', approved: 4, rejected: 1, pending: 3 },
    { month: 'Apr', approved: 6, rejected: 0, pending: 2 },
    { month: 'May', approved: 5, rejected: 3, pending: 1 },
    { month: 'Jun', approved: 8, rejected: 1, pending: 4 }
  ];

  const topPerformingVenues = [
    { name: 'Elite Tennis Club', bookings: 45, revenue: 2250 },
    { name: 'City Basketball Center', bookings: 38, revenue: 1520 },
    { name: 'Premier Sports Complex', bookings: 32, revenue: 1120 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-lg text-gray-600 mt-2">Complete overview of platform performance and user activity</p>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-enhanced p-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+15% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-enhanced p-6 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Facility Owners</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.totalFacilityOwners}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+8% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-enhanced p-6 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.totalBookings}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+22% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-enhanced p-6 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Active Courts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.totalActiveCourts}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">+5% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1M21 3H3l1.5 1M21 3l-1.5 1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Booking Activity */}
          <div className="chart-enhanced">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Trends (6 Months)</h2>
            <div className="space-y-4">
              {bookingTrends.map(data => (
                <div key={data.month} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Bookings</span>
                      <span className="text-xs font-medium text-gray-900">{data.bookings}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${(data.bookings / 70) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Registrations */}
          <div className="chart-enhanced">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Growth</h2>
            <div className="space-y-4">
              {userRegistrations.map(data => (
                <div key={data.month} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">New Users</span>
                      <span className="text-xs font-medium text-gray-900">{data.users}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${(data.users / 30) * 100}%`}}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Growth</span>
                      <span className="text-xs font-medium text-green-600">+{data.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facility Approvals */}
          <div className="chart-enhanced">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Facility Management</h2>
            <div className="space-y-4">
              {facilityApprovals.map(data => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{data.month}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-green-600">{data.approved} approved</span>
                      <span className="text-red-600">{data.rejected} rejected</span>
                      <span className="text-yellow-600">{data.pending} pending</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div 
                      className="bg-green-500 h-2 rounded-l-full" 
                      style={{width: `${(data.approved / (data.approved + data.rejected + data.pending)) * 100}%`}}
                    ></div>
                    <div 
                      className="bg-red-500 h-2" 
                      style={{width: `${(data.rejected / (data.approved + data.rejected + data.pending)) * 100}%`}}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-2 rounded-r-full" 
                      style={{width: `${(data.pending / (data.approved + data.rejected + data.pending)) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Venues */}
          <div className="card-enhanced p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Venues</h2>
            <div className="space-y-4">
              {topPerformingVenues.map((venue, index) => (
                <div key={venue.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{venue.name}</h4>
                      <p className="text-sm text-gray-600">{venue.bookings} bookings this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">${venue.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="card-enhanced p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Facility Approvals</h4>
                    <p className="text-sm text-gray-600">1 facility waiting for review</p>
                  </div>
                </div>
                <button className="btn-secondary-enhanced text-sm">
                  Review Now
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reports & Issues</h4>
                    <p className="text-sm text-gray-600">3 reports need attention</p>
                  </div>
                </div>
                <button className="btn-secondary-enhanced text-sm">
                  View Reports
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">User Verifications</h4>
                    <p className="text-sm text-gray-600">5 users need verification</p>
                  </div>
                </div>
                <button className="btn-secondary-enhanced text-sm">
                  Verify Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Facility Approval Page Component
const FacilityApprovalPage = ({ venues, setVenues }) => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [comments, setComments] = useState('');

  const pendingFacilities = venues.filter(v => v.status === 'pending');

  const handleApprove = (facilityId) => {
    if (window.confirm('Approve this facility?')) {
      setVenues(venues.map(v => 
        v.id === facilityId ? { ...v, status: 'approved' } : v
      ));
      setSelectedFacility(null);
      alert('Facility approved successfully!');
    }
  };

  const handleReject = (facilityId) => {
    if (!comments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    if (window.confirm('Reject this facility? The owner will be notified.')) {
      setVenues(venues.map(v => 
        v.id === facilityId ? { ...v, status: 'rejected', rejectionReason: comments } : v
      ));
      setSelectedFacility(null);
      setComments('');
      alert('Facility rejected. Owner will be notified.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Facility Approval</h1>

        {/* Pending Facilities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingFacilities.map(facility => (
            <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={facility.images[0] || 'https://via.placeholder.com/300x200'} 
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{facility.name}</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{facility.address}</p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{facility.description}</p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {facility.sportTypes.map(sport => (
                      <span key={sport} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {sport}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {facility.amenities.join(', ')}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFacility(facility)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Review Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {pendingFacilities.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No facilities pending approval</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Facility</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Photos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFacility.images.map((image, index) => (
                      <img key={index} src={image} alt={`${selectedFacility.name} ${index + 1}`} 
                           className="w-full h-32 object-cover rounded" />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Facility Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{selectedFacility.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{selectedFacility.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedFacility.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sports</label>
                      <p className="text-gray-900">{selectedFacility.sportTypes.join(', ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amenities</label>
                      <p className="text-gray-900">{selectedFacility.amenities.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (required for rejection)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  placeholder="Add comments about the facility..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setSelectedFacility(null);
                    setComments('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleReject(selectedFacility.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedFacility.id)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// User Management Page Component
const UserManagementPage = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBanUser = (userId) => {
    if (window.confirm('Ban this user? They will not be able to access the platform.')) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
      alert('User has been banned');
    }
  };

  const handleUnbanUser = (userId) => {
    if (window.confirm('Unban this user? They will regain access to the platform.')) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
      alert('User has been unbanned');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      banned: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Roles</option>
                <option value="user">End Users</option>
                <option value="facility_owner">Facility Owners</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setStatusFilter('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-gray-600">End Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.role === 'facility_owner').length}
            </div>
            <div className="text-sm text-gray-600">Facility Owners</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {users.filter(u => u.status === 'banned').length}
            </div>
            <div className="text-sm text-gray-600">Banned Users</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {user.role.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        Ban User
                      </button>
                    ) : user.status === 'banned' ? (
                      <button
                        onClick={() => handleUnbanUser(user.id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Unban User
                      </button>
                    ) : null}
                    <button className="text-blue-600 hover:text-blue-900">
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">No users match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reports & Moderation Page Component
const ReportsModerationPage = () => {
  const [reports] = useState([
    {
      id: 1,
      reportType: 'Facility Issue',
      reportedItem: 'Elite Tennis Club',
      reportedBy: 'John Smith',
      reason: 'Court was dirty and not properly maintained',
      date: '2025-01-15',
      status: 'pending'
    },
    {
      id: 2,
      reportType: 'User Behavior',
      reportedItem: 'User #45',
      reportedBy: 'Sarah Johnson',
      reason: 'Inappropriate behavior during booking',
      date: '2025-01-14',
      status: 'resolved'
    },
    {
      id: 3,
      reportType: 'Facility Issue',
      reportedItem: 'City Basketball Center',
      reportedBy: 'Mike Davis',
      reason: 'Equipment was broken and dangerous',
      date: '2025-01-13',
      status: 'investigating'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [actionNotes, setActionNotes] = useState('');

  const handleTakeAction = (reportId, action) => {
    if (window.confirm(`${action} this report?`)) {
      alert(`Report ${action.toLowerCase()}ed. Appropriate actions have been taken.`);
      setSelectedReport(null);
      setActionNotes('');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      investigating: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Moderation</h1>

        {/* Reports Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {reports.filter(r => r.status === 'investigating').length}
            </div>
            <div className="text-sm text-gray-600">Under Investigation</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-gray-600">{reports.length}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map(report => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.reportType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.reportedItem}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.reportedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(report.status)}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Report</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Report Type</label>
                  <p className="text-gray-900">{selectedReport.reportType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reported Item</label>
                  <p className="text-gray-900">{selectedReport.reportedItem}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reported By</label>
                  <p className="text-gray-900">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-gray-900">{selectedReport.reason}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{selectedReport.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Status</label>
                  <span className={getStatusBadge(selectedReport.status)}>
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Notes</label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  placeholder="Add notes about the action taken..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setActionNotes('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleTakeAction(selectedReport.id, 'Dismiss')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleTakeAction(selectedReport.id, 'Take Action')}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Take Action
                </button>
                <button
                  onClick={() => handleTakeAction(selectedReport.id, 'Resolve')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(mockUsers[0]); // Default to first user
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookings, setBookings] = useState(mockBookings);
  const [venues, setVenues] = useState(mockVenues);
  const [users, setUsers] = useState(mockUsers);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = (event) => {
      setCurrentPage(event.detail);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setSelectedVenue={setSelectedVenue} />;
      case 'venues':
        return <VenuesPage setCurrentPage={setCurrentPage} setSelectedVenue={setSelectedVenue} />;
      case 'venue-detail':
        return <VenueDetailPage venue={selectedVenue} setCurrentPage={setCurrentPage} setSelectedCourt={setSelectedCourt} />;
      case 'court-booking':
        return <CourtBookingPage court={selectedCourt} venue={selectedVenue} setCurrentPage={setCurrentPage} bookings={bookings} setBookings={setBookings} />;
      case 'my-bookings':
        return <MyBookingsPage bookings={bookings} setBookings={setBookings} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'facility-management':
        return <FacilityManagementPage venues={venues} setVenues={setVenues} />;
      case 'court-management':
        return <CourtManagementPage venues={venues} setVenues={setVenues} />;
      case 'time-slot-management':
        return <TimeSlotManagementPage venues={venues} />;
      case 'booking-overview':
        return <BookingOverviewPage bookings={bookings} venues={venues} />;
      case 'admin-dashboard':
        return <AdminDashboard venues={venues} users={users} bookings={bookings} />;
      case 'facility-approval':
        return <FacilityApprovalPage venues={venues} setVenues={setVenues} />;
      case 'user-management':
        return <UserManagementPage users={users} setUsers={setUsers} />;
      case 'reports-moderation':
        return <ReportsModerationPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedVenue={setSelectedVenue} />;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      bookings, setBookings,
      venues, setVenues,
      users, setUsers
    }}>
      <div className="App">
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
        {renderPage()}
      </div>
    </AppContext.Provider>
  );
};

export default App;