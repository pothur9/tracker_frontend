"use client";

import React, { Suspense, useEffect, useState } from 'react'
import HolidaySearch from '../components/HolidaySearch';
import HolidayResults from '../components/HolidayResults'
import { useSearchParams } from 'next/navigation'
import HolidayFilter from '../components/HolidayFilter'

export interface Holiday{
    _id : string,
    title : string,
    Durations : number,
    TotalFare : number,
    highlights : string[],
    additionalHighlights : string[],
    Images : [string]
}

const temp = [
  { 
    _id: "1",
    title: "Goa Beach Paradise",
    location: "Goa",
    Durations: 5,
    TotalFare: 20000,
    highlights: [
      "Round Trip Flights", "5 Star Hotel", "Airport Transfers", "All Meals Included", "Water Sports"
    ],
    additionalHighlights: [
      "Sunset Cruise",
      "Scuba Diving",
    ],
    Rooms: [
      {
        BookingCode: "GOA123",
        Name: [
          "Ocean View Suite"
        ],
        TotalFare: "20000",
        TotalTax: "2000",
      }
    ],
    Images: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080"
    ]
  },
  {
    _id: "2",
    title: "Kerala Backwaters Retreat",
    location: "Kerala",
    Durations: 4,
    TotalFare: 18000,
    highlights: [
      "Round Trip Flights", "4 Star Hotel", "Houseboat Stay", "All Meals Included", "Ayurvedic Spa"
    ],
    additionalHighlights: [
      "Backwater Cruise",
      "Kathakali Performance",
    ],
    Rooms: [
      {
        BookingCode: "KER456",
        Name: [
          "Deluxe Houseboat"
        ],
        TotalFare: "18000",
        TotalTax: "1800",
      }
    ],
    Images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080"
    ]
  },
  {
    _id: "3",
    title: "Rajasthan Royal Tour",
    location: "Rajasthan",
    Durations: 7,
    TotalFare: 25000,
    highlights: [
      "Round Trip Flights", "Heritage Hotel", "Camel Safari", "All Meals Included", "Cultural Shows"
    ],
    additionalHighlights: [
      "Desert Camping",
      "Palace Visits",
    ],
    Rooms: [
      {
        BookingCode: "RAJ789",
        Name: [
          "Royal Suite"
        ],
        TotalFare: "25000",
        TotalTax: "2500",
      }
    ],
    Images: [
      "https://images.unsplash.com/photo-1544717305-996b815c338c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080"
    ]
  },
  {
    _id: "4",
    title: "Andaman Island Adventure",
    location: "Andaman",
    Durations: 6,
    TotalFare: 22000,
    highlights: [
      "Round Trip Flights", "Beach Resort", "Snorkeling", "All Meals Included", "Island Hopping"
    ],
    additionalHighlights: [
      "Scuba Diving",
      "Glass Bottom Boat Ride",
    ],
    Rooms: [
      {
        BookingCode: "AND101",
        Name: [
          "Beachfront Villa"
        ],
        TotalFare: "22000",
        TotalTax: "2200",
      }
    ],
    Images: [
      "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwaG9saWRheXxlbnwwfHx8fDE2MzY2NzY5NzQ&ixlib=rb-1.2.1&q=80&w=1080"
    ]
  }
];

export default function SearchResultsClient(){
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedFrom, setSelectedFrom] = React.useState(searchParams.get('from') || '')
  const [selectedTo, setSelectedTo] = React.useState(searchParams.get('to') || '')
  const [departureDate, setDepartureDate] = React.useState<Date>(
    searchParams.get("date")
    ? new Date(searchParams.get("date")!)
    : new Date()
  )
  const [passengers, setPassengers] = React.useState({
    rooms : Number(searchParams.get('rooms')) || 1,
    adults : Number(searchParams.get('adults')) || 1,
    children : Number(searchParams.get('children')) || 0,
  })

  const [holidays, setHolidays] = useState<Holiday[]>([])

  // Filters
  const [filters, setFilters] = useState({
    duration: {
      min : 2,
      max : 7,
    },
    budget: {
      min : 0,
      max : 50000
    },
    hotelCategory: [],
    city: '',
    themes: []
  });

  useEffect(() => {
    const searchHolidays = async () => {
      if(!selectedFrom || !selectedTo || !departureDate) return

      try{
        setLoading(true);
        setError(null)

        const results = localStorage.getItem('holidaysSearchResults');
        if(results){
          const parsedResults = JSON.parse(results)

          if(parsedResults.from === selectedFrom && parsedResults.to === selectedTo && parsedResults.date === departureDate.toISOString()){
            setFilters(parsedResults.filters)
          }
        }
      } catch(err){
        console.error(err)
        setError('An error occurred while searching for holidays')
      } finally {
        setLoading(false)
      }
    }
  },[selectedFrom, selectedTo, departureDate])

  const handleSearch = () => {
    console.log('searching for holidays')
    // Update the filters values
    // const holidays = await call()
    // setHolidays(holidays)
  }

  useEffect(() => {
    console.log('filters updated')
  },[holidays])
  return (
    <div>
        <div  className='w-4/5 mx-auto'>
          <HolidaySearch 
            selectedFrom={selectedFrom}
            setSelectedFrom={setSelectedFrom}
            selectedTo={selectedTo}
            setSelectedTo={setSelectedTo}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            handleSearch={handleSearch}
            loading={loading}
            passengers={passengers}
            setPassengers={setPassengers}
          />

        </div>
       <div className='w-full md:w-3/4 mx-auto flex flex-col md:gap-4 md:flex-row mt-4 overflow-hidden pb-8'>
        <HolidayFilter filters={filters} setFilters={setFilters} />
        <HolidayResults holidays={temp}/>
        </div>
      </div>
  )
}