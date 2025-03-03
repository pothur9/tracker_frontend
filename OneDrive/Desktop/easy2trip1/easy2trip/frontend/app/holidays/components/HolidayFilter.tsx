import React, { useState } from 'react';
import MutliRangeSlider from '../../components/multiRangeSlider/MultiRangeSlider';
import { Star } from 'lucide-react';

const HolidayFilter = ({ filters , setFilters }) => {
  const onDurationChange = (min : number, max : number ) => {
    // LOOP - setFilters({ ...filters, duration: { minN: min, maxN: max } });
  }
  const onBudgetChange = (min : number, max : number ) => {

  }
  return (
    <div className='w-100 md:w-80 bg-white p-6 sticky top-0 md:h-[calc(100vh-6rem)] overflow-y-auto z-10 shadow-lg border-t border-r flex-shrink-0'>
      {/* Duration Filter */}
      <div className='w-full mb-4'>
        <h2 className='font-semibold mb-2 text-sm md:text-base'>Duration (in Nights)</h2>
        <MutliRangeSlider suffix='N' min={filters.duration.min} max={filters.duration.max} onChange={({min, max}) => onDurationChange(min, max)}/>
      </div>
      
      {/* Budget Per Person */}
      <div className='w-full mb-4'>
        <h2 className='font-semibold mb-2 text-sm md:text-base'>Budget Per Person (₹)</h2>
        <MutliRangeSlider prefix='₹' min={filters.budget.min} max={filters.budget.max} onChange={({min, max}) => onBudgetChange(min, max)}/>
      </div>

      {/* Hotel Category */}
      <div className='w-full mb-4'>
      <h2 className='font-semibold mb-2 text-sm md:text-base'>Hotel Category</h2>
      <div className="flex gap-2">
        {[5, 4, 3].map((star) => (
          <div 
            key={star} 
            className={`px-4 flex gap-1 items-center py-2 rounded-lg border cursor-pointer text-sm transition-all 
              ${filters.hotelCategory.includes(star) ? 'bg-blue-100 border-blue-600' : 'bg-white border-gray-300 hover:border-blue-400'}`}
            onClick={() => {
              const newCategories = filters.hotelCategory.includes(star)
                ? filters.hotelCategory.filter((cat) => cat !== star)
                : [...filters.hotelCategory, star];
              setFilters({ ...filters, hotelCategory: newCategories });
            }}
          >
            <span className=''>{star}</span><span><Star key={star} className="w-3 h-3 fill-gray-600 text-black-400"/></span>
          </div>
        ))}
      </div>
    </div>


      {/* Cities Filter */}
      <div className='w-full mb-4'>
        <h2 className='font-semibold mb-2 text-sm md:text-base'>Cities</h2>
        <input 
          type='text' 
          placeholder='Enter city name' 
          value={filters.city} 
          onChange={(e) => setFilters({ ...filters, city: e.target.value })} 
          className='w-full border rounded p-2' 
        />
      </div>

      {/* Themes Filter */}
      <div className='w-full mb-4'>
        <h2 className='font-semibold mb-2 text-sm md:text-base'>Themes</h2>
        {['Adventure', 'Beach', 'Family', 'Honeymoon', 'Wildlife'].map((theme) => (
          <label key={theme} className='flex items-center gap-2 cursor-pointer'>
            <input 
              type='checkbox' 
              checked={filters.themes.includes(theme)} 
              onChange={(e) => {
                const newThemes = e.target.checked
                  ? [...filters.themes, theme]
                  : filters.themes.filter((t) => t !== theme);
                setFilters({ ...filters, themes: newThemes });
              }}
              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500' 
            />
            <span className='text-sm'>{theme}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default HolidayFilter;
