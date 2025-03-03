import React from 'react'

export const HolidayCard = ({ holiday, onClick }: { holiday: any, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-xl hover:shadow-2xl hover:border-gray-300 transition-transform transform hover:scale-105 cursor-pointer"
    >
      <div className="w-full md:w-100 h-48 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={holiday.Images[0]}
          alt={holiday.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className='w-full flex flex-col items-center gap-2'>
        <div className='w-full flex justify-between gap-2 border-b pb-2 md:px-4'>
          <div className='flex flex-col gap-0'>
            <div className='text-md md:text-lg font-semibold'>{holiday.title}</div>
            <div className='text-sm md:text-base'>{holiday.Durations}N{" "}{holiday?.location}</div>
          </div>
          <span className='text-xs md:text-sm h-8 flex items-center justify-center border rounded-xl px-2'>{holiday.Durations}N/{holiday.Durations+1}D</span>
        </div>
        <div className='w-full grid grid-cols-2 gap-1 mt-1 md:px-4'>
          {holiday.highlights.map((highlight: string, index: string) => (
            <span key={index} className="text-sm md:text-md inline-flex items-center before:content-['•'] before:mr-2 text-gray-500">{highlight}</span>
          ))}
        </div>
        <div className='w-full flex justify-between mt-4 bg-gray-50 rounded-lg px-4 py-4 border border-gray-200'>
          <div className='text-sm md:text-md w-1/2 text-gray-500'>This price is lower than the average price in March</div>
          <div className='w-1/3 flex flex-col gap-0'>
            <span><span className='text-lg md:text-xl font-semibold'>₹{holiday.TotalFare}</span><span className='text-xs md:text-md text-gray-500'>/Person</span></span>
            <span className='text-sm md:text-md text-gray-500'>Total Price ₹{holiday.TotalFare}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HolidayCard