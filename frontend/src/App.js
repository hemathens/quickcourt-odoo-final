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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">QuickCourt</h1>
          </div>
          
          {/* Role Switch */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Switch Role:</span>
              <select 
                value={role || 'user'} 
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="user">End User</option>
                <option value="facility_owner">Facility Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {role === 'user' && (
                <>
                  <button onClick={() => setCurrentPage('home')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'home' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Home</button>
                  <button onClick={() => setCurrentPage('venues')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'venues' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Venues</button>
                  <button onClick={() => setCurrentPage('my-bookings')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'my-bookings' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>My Bookings</button>
                  <button onClick={() => setCurrentPage('profile')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'profile' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Profile</button>
                </>
              )}
              {role === 'facility_owner' && (
                <>
                  <button onClick={() => setCurrentPage('owner-dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'owner-dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Dashboard</button>
                  <button onClick={() => setCurrentPage('facility-management')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'facility-management' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Facilities</button>
                  <button onClick={() => setCurrentPage('court-management')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'court-management' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Courts</button>
                  <button onClick={() => setCurrentPage('time-slot-management')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'time-slot-management' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Time Slots</button>
                  <button onClick={() => setCurrentPage('booking-overview')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'booking-overview' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Bookings</button>
                </>
              )}
              {role === 'admin' && (
                <>
                  <button onClick={() => setCurrentPage('admin-dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'admin-dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Dashboard</button>
                  <button onClick={() => setCurrentPage('facility-approval')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'facility-approval' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Facility Approval</button>
                  <button onClick={() => setCurrentPage('user-management')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'user-management' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Users</button>
                  <button onClick={() => setCurrentPage('reports-moderation')} className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'reports-moderation' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Reports</button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-700">{currentUser?.name}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = ({ setCurrentPage, setSelectedVenue }) => {
  const popularVenues = mockVenues.filter(v => v.status === 'approved').slice(0, 3);
  const popularSports = ["Tennis", "Basketball", "Badminton", "Football"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="relative bg-cover bg-center h-96 flex items-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1499510318569-1a3d67dc3976?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHx0ZW5uaXMlMjBjb3VydHxlbnwwfHx8fDE3NTQ5MDAxMTJ8MA&ixlib=rb-4.1.0&q=85')`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Book Your Perfect Court</h1>
              <p className="text-xl md:text-2xl mb-8">Find and reserve sports facilities in your area</p>
              <button 
                onClick={() => setCurrentPage('venues')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Browse Venues
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Venues Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Venues</h2>
          <p className="text-lg text-gray-600">Discover top-rated sports facilities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularVenues.map(venue => (
            <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <img 
                src={venue.images[0]} 
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-2">{venue.sportTypes.join(', ')}</p>
                <div className="flex justify-between items-center">
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
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Sports Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Sports</h2>
            <p className="text-lg text-gray-600">Find courts for your favorite sport</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSports.map(sport => (
              <button 
                key={sport}
                onClick={() => setCurrentPage('venues')}
                className="bg-gray-100 hover:bg-blue-50 border hover:border-blue-200 rounded-lg p-6 text-center transition duration-300"
              >
                <div className="text-3xl mb-2">🏅</div>
                <h3 className="font-semibold">{sport}</h3>
              </button>
            ))}
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

  const bookingData = [
    { day: 'Mon', bookings: 12 },
    { day: 'Tue', bookings: 8 },
    { day: 'Wed', bookings: 15 },
    { day: 'Thu', bookings: 10 },
    { day: 'Fri', bookings: 18 },
    { day: 'Sat', bookings: 22 },
    { day: 'Sun', bookings: 16 }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facility Owner Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's how your facilities are performing.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.totalBookings}</p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
            <div className="mt-2 text-sm text-green-600">+12% from last month</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Active Courts</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.activeCourts}</p>
              </div>
              <div className="text-3xl">🏟️</div>
            </div>
            <div className="mt-2 text-sm text-blue-600">All operational</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                <p className="text-3xl font-bold text-gray-900">${kpis.monthlyEarnings}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <div className="mt-2 text-sm text-green-600">+8% from last month</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900">{kpis.occupancyRate}%</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
            <div className="mt-2 text-sm text-green-600">+5% from last month</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Booking Trends</h2>
            <div className="space-y-3">
              {bookingData.map(data => (
                <div key={data.day} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{data.day}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{width: `${(data.bookings / 25) * 100}%`}}
                    ></div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{data.bookings}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Peak Booking Hours</h2>
            <div className="space-y-3">
              {peakHours.map(data => (
                <div key={data.hour} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{data.hour}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-green-600 h-4 rounded-full" 
                      style={{width: `${(data.bookings / 25) * 100}%`}}
                    ></div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{data.bookings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Calendar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Booking Calendar</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Time</th>
                  <th className="text-left py-2 px-4">Court 1</th>
                  <th className="text-left py-2 px-4">Court 2</th>
                  <th className="text-left py-2 px-4">Court 3</th>
                  <th className="text-left py-2 px-4">Court 4</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.slice(0, 8).map(time => (
                  <tr key={time} className="border-b">
                    <td className="py-2 px-4 font-medium">{time}</td>
                    <td className="py-2 px-4">
                      {Math.random() > 0.5 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Booked
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {Math.random() > 0.5 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Booked
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {Math.random() > 0.5 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Booked
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {Math.random() > 0.5 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Booked
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
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