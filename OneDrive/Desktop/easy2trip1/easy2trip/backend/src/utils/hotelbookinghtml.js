// const bookingDetails = {
//   "booking_id": "NH24253383420690",
//   "booking_pnr": "0140887128",
//   "booking_date": "Feb 05, 2025",
//   "status": "Booking Confirmed",
//   "travel_agency": {
//     "name": "Kavitha Tours and Travels",
//     "address": ["National Highway, Banavara, Karnataka"],
//     "contact_number": "9886177554",
//     "email": "kavithatours.info@gmail.com"
//   },
//   "hotel": {
//     "name": "Taj Cidade de Goa Horizon",
//     "location": "Goa",
//     "stay_duration": "2 Nights",
//     "rating": 5,
//     "amenities": ["Free WiFi", "Swimming Pool", "Breakfast Included", "Gym"]
//   },
//   "passenger": {
//     "name": "John Doe",
//     "check_in": "Feb 10, 2025",
//     "check_out": "Feb 12, 2025",
//     "guests": 2,
//     "room_type": "Deluxe Room"
//   },
//   "payment": {
//     "total_amount": "12,500",
//     "payment_method": "Credit Card",
//     "transaction_id": "TXN1234567890",
//     "base_amount": "10,000",
//     "fee": "2,500"
//   }
// }

const generateHotelBookingHtml = (bookingDetails) => {
  // const generateHotelBookingHtml = () => {
    const stars = Array(bookingDetails.hotel.rating).fill('<span class="star filled">★</span>').join('') + Array(5 - bookingDetails.hotel.rating).fill('<span class="star unfilled">★</span>').join('');
   return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Easy2Trip Booking Confirmation</title>
      <style>
      *{
          padding: 0;
          margin: 0;
          box-sizing: border-box;
      }
        body {
          font-family: "Segoe UI", Roboto, sans-serif;
          background-color: #f8f9fa;
          margin: 0;
          padding: 1.25rem;
          text-align: center;
          line-height: 1.25rem;
          max-width: 1240px;
          margin: 0 auto;
          width: 100vw;
          height: 100vh;
          overflow-x: hidden;
          color: rgb(66, 66, 66);
        }
        .rating {
          margin-bottom: 12px;
          font-size: 18px;
        }
  
        .star {
          font-size: 20px;
          margin-right: 3px;
        }
  
        .filled {
          color: gray;
        }
        .unfilled {
          color: lightgray;
        }
        .text-bold{
          font-size: 1.25rem;
          font-weight: 700;
        }
        .r1{
          display: flex;
          width: 100%;
          padding: 1rem 0;
        }
        .r1>div:nth-child(1){
          width: 65%;
          justify-content: flex-start;
          text-align: start;
        }
        .r1>div:nth-child(2){
          width: 35%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .r2{
          border-top: 1px solid rgb(184, 181, 181);
          border-bottom: 1px solid rgb(184, 181, 181);
          padding: 1rem 0;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .r2>div{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .r3{
          margin-top: 1.25rem;
          display: flex;
          flex-direction: column;
        }
        .r3>div:nth-child(1){
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .r4, .r5{
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          background-color: rgb(240, 240, 240);
          border-radius: .5rem;
        }
        .r5{
          align-items: flex-start;
          gap : 0.5rem;
        }
        .text-gray{
          color: #555555cc;
        }
        .r6{
          margin: 1.5rem 0 ;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          padding: 0 1rem;
        }
        .r6>p:nth-child(1){
          font-size: 1.5rem;
          font-weight: 600;
        }
        .text-blue{
          color: rgb(16, 16, 175);
  
        }
        .r6>p:nth-child(2){
          text-align: left;
        }
        .r7{
          padding: 1rem;
          border: 1px solid gray;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .r7>div{
          font-size: 1.05rem;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          border-bottom: 1px solid gray;
          padding: 1.25rem 0.5rem;
        }
        .r8{
          width: 100%;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
       
      </style>
    </head>
  
    <body>
      <div class="r1">
          <div ><img src="https://easy2trip.com/easy2trip.png" height="50" alt=""></div>
          <div>
              <p style="margin-bottom: 1rem; font-size: 1.5rem;" class="text-bold">${bookingDetails.travel_agency.name}</p>
              <p>${bookingDetails.travel_agency.address[0]}</p>
              <p>${bookingDetails.travel_agency.address[1]}</p>
              <p>Contact Number - ${bookingDetails.travel_agency.contact_number}</p>
              <p>Email ID - ${bookingDetails.travel_agency.email}</p>
          </div>
      </div>
      <div class="r2">
          <div>
              <p>Booking ID</p>
              <p class="text-bold">${bookingDetails.booking_id}</p>
          </div>
          <div>
              <p>Booking PNR</p>
              <p class="text-bold">${bookingDetails.booking_pnr}</p>
          </div>
          <div>
              <p>Booking Date</p>
              <p class="text-bold">${bookingDetails.booking_date}</p>
          </div>
          <div style="font-size: 1.2rem; font-weight: 600; background-color: greenyellow; color: green; border-radius: 2rem; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.5rem 1rem; text-transform: uppercase;">
            <div style="width:1rem; height: 1rem;">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 101.6"><defs><style>.cls-1{fill:#10a64a;}</style></defs><title>tick-green</title><path class="cls-1" d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z"/></svg>
            </div>
            <span>${bookingDetails.status}</span>
          </div>
      </div>
      <div class="r3">
        <div>
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: .45rem;">
            <p>Hotel in ${bookingDetails.hotel.location} | <span style="font-size: 1.15rem; font-weight: 700;">${bookingDetails.hotel.stay_duration}</span></p>
            <p style="display: flex; gap: 0.25rem; font-size: 1.75rem; font-weight: 600;">${bookingDetails.hotel.name}<span>${stars}</span></p>
          </div>
          <div style="display: flex;gap:0.25rem; align-items: center;background-color: lightblue; color : blue; padding: 0.5rem 1rem; border-radius: 2rem;">
            <div style="width: 1rem; height: 1rem;">
              <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 405.061 405.061" xml:space="preserve">
           <path id="XMLID_650_" d="M257.921,101.777c0-30.541-24.848-55.389-55.39-55.389c-30.542,0-55.389,24.848-55.389,55.389
             c0,30.542,24.848,55.39,55.389,55.39C233.073,157.167,257.921,132.319,257.921,101.777z M165.142,101.777
             c0-20.616,16.772-37.389,37.389-37.389c20.617,0,37.39,16.772,37.39,37.389c0,20.617-16.772,37.39-37.39,37.39
             C181.915,139.167,165.142,122.395,165.142,101.777z M170.86,271.723c5.229,10.965,11.738,24.611,31.671,24.611
             c19.936,0,26.442-13.646,31.671-24.612c0.672-1.41,13.521-26.774,13.521-26.774c27.379-53.808,56.589-113.684,56.589-143.17
             C304.312,45.657,258.653,0,202.531,0c-56.121,0-101.778,45.657-101.778,101.777c0,29.484,29.209,89.361,56.588,143.171
             C157.341,244.948,170.188,270.313,170.86,271.723z M202.531,18c46.196,0,83.78,37.582,83.78,83.777
             c0,27.64-36.899,100.157-54.632,135.007c0,0-12.996,25.661-13.726,27.19c-5.087,10.67-7.262,14.359-15.423,14.359
             c-8.16,0-10.335-3.69-15.424-14.36c-0.729-1.528-13.724-27.188-13.724-27.188c-17.732-34.852-54.63-107.37-54.63-135.008
             C118.753,55.582,156.336,18,202.531,18z M369.181,309.08c0,52.924-43.056,95.98-95.979,95.98H131.86
             c-52.924,0-95.98-43.057-95.98-95.98c0-19.509,5.883-38.319,17.012-54.398C63.746,239,78.795,226.983,96.412,219.93
             c4.613-1.846,9.853,0.395,11.701,5.011c1.847,4.614-0.396,9.853-5.01,11.7C73.661,248.428,53.88,277.539,53.88,309.08
             c0,42.999,34.982,77.98,77.98,77.98h141.342c42.997,0,77.979-34.981,77.979-77.98c0-31.541-19.782-60.652-49.225-72.439
             c-4.615-1.848-6.858-7.086-5.011-11.7s7.087-6.86,11.7-5.011c17.617,7.054,32.667,19.07,43.522,34.752
             C363.298,270.761,369.181,289.571,369.181,309.08z M109.09,309.08c0,14.222,11.57,25.792,25.791,25.792h135.296
             c14.223,0,25.793-11.57,25.793-25.792c0-11.065-7.078-20.892-17.612-24.451c-4.709-1.592-7.236-6.698-5.646-11.407
             c1.592-4.709,6.698-7.238,11.407-5.646c17.854,6.033,29.851,22.713,29.851,41.504c0,24.147-19.646,43.792-43.793,43.792H134.881
             c-24.146,0-43.791-19.645-43.791-43.792c0-18.792,11.997-35.472,29.852-41.505c4.708-1.588,9.816,0.937,11.407,5.646
             s-0.937,9.816-5.646,11.407C116.168,288.188,109.09,298.015,109.09,309.08z"/>
           </svg>
            </div>
            <span>Get Directions</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; margin-bottom: 1.5rem;">
          <p>Vainguinim Beach, Dona Paula, Panaji, North Goa, Goa - 403004, Goa, IN</p>
          <p>Contact Number - 00918322454545</p>
          <p>Email ID - reservations.tcdghorizon@tajhotels.com,ankush.gagneja@tajhotels.com,gaurang.amdekar@tajhotels.com</p>
        </div>
        <div style="width : 100% ;display: flex; flex-direction: row; align-items: flex-start; gap: 1rem; margin-top: 1rem; margin-bottom: 1.5rem;">
          <div style="width: 35%;overflow: hidden;"><img style="width:400px;object-fit: contain;" src="/beach.jpg" alt=""></div>
          <div style="width: 65%; text-align: start;">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                <p style="font-weight: 600;">Check In</p>
                <p style="font-size: 1.75rem; font-weight: 600;">02:00 PM</p>
                <p>Wed, ${bookingDetails.passenger.check_in}</p>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                <p style="font-weight: 600;">Check Out</p>
                <p style="font-size: 1.75rem; font-weight: 600;">12:00 PM</p>
                <p>Fri, ${bookingDetails.passenger.check_out}</p>
              </div>
            </div>
            <div style="margin-top: 3rem;">
              <p><span style="font-weight: 600;">Reservation for</span> - 2 Night | ${bookingDetails.passenger.adults} Adults, ${bookingDetails.passenger.childrens | 0} Children | 1 Room</p>
              <p>${bookingDetails.passenger.name} (Primary Guest) + ${bookingDetails.passenger.guests - 1} Others</p>
            </div>
          </div>
        </div>
      </div>
      <div class="r4">
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; border-bottom: 1px solid gray; padding: 1rem 0;">
          <p><span>Room 1 -</span>${bookingDetails.passenger.room_type}</p>
          <div style="display: flex; align-items: center; gap: .5rem;">
            <div style="width:1rem; height: 1rem;">
              <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 575.616 575.616"
              xml:space="preserve">
            <g>
              <g>
                <path d="M429.248,141.439C429.248,63.33,365.985,0,287.808,0c-78.109,0-141.439,63.33-141.439,141.439
                  c0,78.11,63.33,141.439,141.439,141.439C365.988,282.878,429.248,219.549,429.248,141.439z M181.727,144.499
                  c0,0-4.079-40.12,24.82-70.72c20.34,20.389,81.261,70.72,187.342,70.72c0,58.498-47.586,106.081-106.081,106.081
                  S181.727,202.994,181.727,144.499z"/>
                <path d="M45.049,391.68v62.559v80.919c0,22.365,18.136,40.459,40.459,40.459h404.6c22.365,0,40.459-18.097,40.459-40.459v-80.919
                  V391.68c0-44.688-36.193-80.919-80.919-80.919H377.91c-5.07,0-11.46,3.422-14.271,7.639l-70.735,99.982
                  c-2.812,4.22-7.372,4.22-10.184,0l-70.738-99.986c-2.812-4.22-9.202-7.638-14.272-7.638h-71.742
                  C81.319,310.758,45.049,346.991,45.049,391.68z"/>
              </g>
            </g>
            </svg>
            </div>
            <div>${bookingDetails.passenger.adults} Adult(s), 0 Children</div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 1rem 0;">
          <p><span class="text-gray">Meal Plan</span> - Breakfast</p>
          <p>
            <span class="text-gray">Inclusions - </span>
            <ul style="display: flex; flex-direction: column; align-items: flex-start; list-style-type: disc; ">
              <li>20% discount on session(s) of Spa. Prior reservation is needed.</li>
              <li>Breakfast included.</li>
              <li>20% discount on food & beverage services. This offer includes Soft Beverages. This offer excludes in-room dining.</li>
              <li>20% discount on session(s) of Salon.</li>
              <li>Special rate with 10percent savings inclusive of daily breakfast.. 20percent Savings on Food & Beverages at</li>
              <li>Restaurants during stay.. 20percent Savings on Spa Therapies and Salon Services during stay.. Inclusive of
                standard Wi-Fi.. Taxes extra, as applicable.</li>
            </ul>
          </p>
        </div>
      </div>
      <div class="r5" style="margin-top: 0.5rem;">
        <p style="font-size: 1.25rem; font-weight: 600;">Guest Details (${bookingDetails.passenger.guests})</p>
        <p style="width:100%; text-align : left;border-bottom: 1px solid gray; padding-bottom: 0.5rem;"><span class="text-gray" style="font-weight: 600; font-size: 1.05rem;">${bookingDetails.passenger.name}</span> (Primary Guest) + ${bookingDetails.passenger.guests - 1}</p>
      </div>
      <div class="r6">
        <p class="text-blue">Cancellation and Amendment Policy</p>
        <p>This is a Non-refundable and non-amendable tariff. Cancellations, or no-shows will be subject to a hotel fee equal to the 100% of booking amount.Cancellations are only allowed before CheckIn.</p>
      </div>
      <div class="r7">
        <p style="font-size: 1.15rem; font-weight: 600; margin-bottom: 0.5rem;" class="text-blue">Payment Breakup (in INR)</p>
        <div>
          <p>Base Charges</p>
          <p>${bookingDetails.payment.base_amount}</p>
        </div>
        <div>
          <p>Fee and Surcharges</p>
          <p>${bookingDetails.payment.fee}</p>
        </div>
        <div style="font-weight: 1000; border: none;">
          <p>Total Amount Paid</p>
          <p>${bookingDetails.payment.total_amount}</p>
        </div>
      </div>
      <div class="r8">
        <div style="display:flex; flex-direction: row; gap:0.5rem; align-items: center; background-color: #fc7f7f; padding: 0.5rem 1rem; border-radius: 2rem;">
          <p style="width:1rem; height: 1rem;">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 101.6"><defs><style>.cls-1{fill:#10a64a;}</style></defs><title>tick-green</title><path class="cls-1" d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z"/></svg>
          </p>
          <p style="font-size: 1.25rem; font-weight: 1000;">Important information</p>
        </div>
        <div style="width: 100%; background-color: #fdf2e9;">
          <ul style="display: flex; flex-direction: column; align-items: flex-start; list-style-position: inside; padding: 1rem 1rem; gap: 0.45rem; padding-bottom: 3rem;">
            <li style="text-align: left;">
              <span style="font-weight: 600;">ID Proof Related</span>
              <div style="display: flex; flex-direction: column; align-items: flex-start;padding: 0 1.25rem; gap: 0.45rem; margin-top: 0.45rem;">
                <p>&#x2022; Local ids not allowed</p>
                <p>&#x2022; Aadhar, Passport, Driving License and Govt. ID are accepted as ID proof(s)</p>
              </div>
            </li>
            <li style="text-align: left;">
              <span style="font-weight: 600;">Must Read</span>
              <div style="display: flex; flex-direction: column; align-items: flex-start;padding: 0 1.25rem; gap: 0.45rem; margin-top: 0.45rem;">
                <p>&#x2022; This rate and cancellation policy is only applicable for booking upto 5 rooms. Bookings with
                  more than 5 rooms are considered group bookings & the right to admission is reserved by
                  hotel with separate cancellation and deposit policy.</p>
                <p>&#x2022; Extra-person charges may apply and vary depending on property policy|Government-issued
                  photo identification and a credit card, debit card, or cash deposit may be required at check-in
                  for incidental charges|Special requests are subject to availability upon check-in and may
                  incur additional charges; special requests cannot be guaranteed|This property accepts credit
                  cards; cash is not accepted|This property uses a grey water recycling system and eco-
                  friendly cleaning products|Safety features at this property include a fire extinguisher, a
                  security system, a first aid kit, and window guards</p>
                  <p>&#x2022; Optional : Fee for buffet breakfast: approximately INR 1000 for adults and INR 500 for
                    children|Early check-in is available for a fee (subject to availability)|Late check-out is
                    available for a fee (subject to availability)|Rollaway bed fee: INR 2500.0 per night</p>
              </div>
            </li>
            <li style="text-align: left;">
              <span style="font-weight: 600;">Guest Profile</span>
              <div style="display: flex; flex-direction: column; align-items: flex-start;padding: 0 1.25rem; gap: 0.45rem; margin-top: 0.45rem;">
              <p>&#x2022; Unmarried couples allowed</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem; margin: 1rem 0.5rem; padding-bottom: 5rem;">
        <span>👽</span>
        <span>Please think twice before printing this mail. <span style="font-weight: 700;">Save paper</span>, it’s good for the environment.</span>
      </div>
    </body>
  </html>
   `
  };
  
  module.exports = generateHotelBookingHtml;
  