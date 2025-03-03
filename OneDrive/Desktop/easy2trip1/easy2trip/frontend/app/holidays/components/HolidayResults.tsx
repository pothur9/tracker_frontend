import React from 'react'
import { HolidayCard } from "./Card/HolidayCard"
import { useRouter } from 'next/navigation'

const HolidayResults = ({ holidays }) => {
  const router = useRouter()

  const handleCardClick = (holiday) => {
    localStorage.setItem(
      `holiday_${holiday._id}`,
      JSON.stringify({
        id: holiday._id,
        holidayName: holiday.HolidayName,
        address: holiday.Address,
        rating: holiday.HolidayRating,
        description: holiday.Description,
        images: JSON.stringify(holiday.Images),
        facilities: JSON.stringify(holiday.HolidayFacilities),
        rooms: JSON.stringify(holiday.Rooms),
        checkInTime: holiday.CheckInTime,
        checkOutTime: holiday.CheckOutTime,
        phoneNumber: holiday.PhoneNumber || "",
        faxNumber: holiday.FaxNumber || "",
        attractions: JSON.stringify(holiday.Attractions || []),
        map: holiday.Map || "",
      })
    );

    router.push(
      `/holidays/${holiday._id}?${new URLSearchParams({
        id: holiday._id,
        rooms: "1",
        adults: "1",
        map: holiday.Map || "",
      }).toString()}`
    );
  }

  return (
    <div className='w-100 md:w-full flex flex-wrap gap-4 flex-shrink-1 flex-grow overflow-hidden'>
      {holidays.map((holiday) => (
        <div key={holiday._id} className="w-full lg:w-[calc(50%-8px)]">
          <HolidayCard 
            holiday={holiday}  
            onClick={() => handleCardClick(holiday)}
          />
        </div>
      ))}
    </div>
  )
}

export default HolidayResults