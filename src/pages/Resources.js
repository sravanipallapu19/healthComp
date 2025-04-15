// src/pages/Resources.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchResources, bookmarkResource } from '../store/slices/resourcesSlice';
import Layout from '../components/Layout/Layout';
import ResourceCard from '../components/Resources/ResourceCard';
import ResourceFilters from '../components/Resources/ResourceFilters';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Resources = () => {
  const dispatch = useDispatch();
  const { resources, isLoading, error } = useSelector((state) => state.resources);
  const { user } = useSelector((state) => state.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [filteredResources, setFilteredResources] = useState([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  useEffect(() => {
    // Fetch resources on component mount
    dispatch(fetchResources());
  }, [dispatch]);
  
  useEffect(() => {
    // Filter resources based on search term and filters
    if (resources) {
      let filtered = [...resources];
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(resource => 
          resource.title.toLowerCase().includes(searchLower) || 
          resource.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply category filter
      if (activeCategory !== 'all') {
        filtered = filtered.filter(resource => resource.category === activeCategory);
      }
      
      // Apply type filter
      if (activeType !== 'all') {
        filtered = filtered.filter(resource => resource.type === activeType);
      }
      
      // Apply bookmarked filter
      if (showBookmarkedOnly && user) {
        filtered = filtered.filter(resource => 
          user.bookmarkedResources && user.bookmarkedResources.includes(resource.id)
        );
      }
      
      setFilteredResources(filtered);
    }
  }, [resources, searchTerm, activeCategory, activeType, showBookmarkedOnly, user]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleTypeChange = (type) => {
    setActiveType(type);
  };
  
  const toggleBookmarkedOnly = () => {
    setShowBookmarkedOnly(!showBookmarkedOnly);
  };
  
  const handleBookmarkToggle = (resourceId) => {
    dispatch(bookmarkResource(resourceId));
  };
  
  // Extract unique categories and types for filters
  const categories = resources ? 
    ['all', ...new Set(resources.map(resource => resource.category))] : 
    ['all'];
  
  const types = resources ? 
    ['all', ...new Set(resources.map(resource => resource.type))] : 
    ['all'];
  
  return (
    <ErrorBoundary>
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Resources</h1>
          <p className="text-gray-600 mb-8">
            Discover helpful articles, videos, exercises, and tools to support your mental well-being
          </p>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-5 sticky top-20">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
                
                <SearchBar 
                  placeholder="Search resources..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="mb-6"
                />
                
                <ResourceFilters
                  categories={categories}
                  types={types}
                  activeCategory={activeCategory}
                  activeType={activeType}
                  showBookmarkedOnly={showBookmarkedOnly}
                  onCategoryChange={handleCategoryChange}
                  onTypeChange={handleTypeChange}
                  onBookmarkedToggle={toggleBookmarkedOnly}
                />
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader size="lg" color="indigo" />
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('all');
                        setActiveType('all');
                        setShowBookmarkedOnly(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isBookmarked={user?.bookmarkedResources?.includes(resource.id)}
                      onBookmarkToggle={() => handleBookmarkToggle(resource.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default Resources;