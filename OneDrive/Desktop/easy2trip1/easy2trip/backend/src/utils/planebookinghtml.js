const generatePlaneBookingHtml = (bookingDetails) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF - Flight Book</title>
        <style>
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            body {
                width: 100vw;
                height: 100vh;
                font-family: Arial, sans-serif;
                padding: 1rem;
                line-height: 1.5rem;
                font-weight: 500;
                font-size: 1rem;
                color: rgb(36, 35, 35);
            }
            .r1{
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }
            .r1>div{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
            }
            .r1>div:nth-child(1){
                padding-left:2.5rem ;
            }
            .text-bold{
                font-weight: 950;
                font-size: 1rem;
                color: rgb(56, 55, 55);
                text-transform: uppercase;
            }
            .text{
                font-size: 1rem;
                color: rgb(102, 102, 102);
                font-weight: normal;
            }
            .r2{
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                margin: 0.5rem 0;
            }
            .r2>div{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                padding: 0.25rem;
            }
            .r2>div:nth-child(1){
                border-right: 1px solid #000;
            }
            .r2>div:nth-child(2){
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }
            .r2>div>div:nth-child(1){
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            .r2>div>div:nth-child(2){
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                gap: 0.1rem;
                border-spacing: 0.5rem;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 0.5rem;
                text-align: left;
            }
            th{
                background-color: rgb(196, 190, 190);
                color: #000;
            }
            .r3{
                display: flex;
                gap: 0.05rem;
                width: 100%;
            }
            .r3 .c1{
                display: flex;
                width: 30%;
                flex-direction: column;
                gap: 0.05rem;
            }
            .r3 .c2{
                display: flex;
                flex-direction: column;
                width: 70%;
                gap: 0.05rem;
            }
            .r3 .italic{
                width: 100%;
                display: flex;
                justify-content: flex-end;
                font-style: italic;
            }
            .bg-black{
                background-color: #000000e1;
                color: #fff;
                padding: 0.65rem 1rem;
            }
            .r4, .r5, .r6, .r7{
                margin-top: 1.5rem;
            }
            ul{
                margin: 0.25rem auto;
                width: 95%;
                display: flex;
                flex-direction: column;
                list-style-type: decimal;
            }
            .r7{
                overflow: hidden;
                width: 100%;
                padding: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="r1">
            <div><img src="${bookingDetails.agency.logo ? bookingDetails.flight.logo : '/easy2trip.png'}" width="120" height="36" alt=""></div>
            <div>
                <div class="text-bold">${bookingDetails.agency.name}</div>
                <div class="text">Email: ${bookingDetails.agency.email}</div>
                <div class="text">Phone: ${bookingDetails.agency.phone}</div>
                <div class="text">Address: ${bookingDetails.agency.address}</div>
            </div>
        </div>
        <div class="r2">
            <div>
                <p class="text">Booking Time: ${bookingDetails.bookedOn}</p>
                <p class="text">Booking ID: ${bookingDetails.bookingId}</p>
                <p class="text">Booking Status: <span class="text-bold">${bookingDetails.bookingStatus}</span></p>
            </div>
            <div>
                <div>
                    <img src="${bookingDetails.flight.logo ? bookingDetails.flight.logo : '/default-airline-logo.svg'}" width="50" height="50" alt="">
                    <span class="text">${bookingDetails.flight.airline}</span>
                </div>
                <div>
                    <p class="text-bold">${bookingDetails.flight.flightNumber}</p>
                    <p class="text">Airline PNR: ${bookingDetails.flight.pnr}</p>
                </div>
            </div>
        </div>
        <div class="r3">
            <div class="c1">
                <p class="bg-black">Flight Detail</p>
                <table>
                    <thead>
                        <tr>
                            <th>Flight</th>
                            <th>Fare Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${bookingDetails.flight.name}</td>
                            <td>NA</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="c2">
                <p class="italic bg-black"><span>Please verify flight timings & terminal info with the airlines</span></p>
                <table>
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Type</th>
                            <th>Departing</th>
                            <th>Arriving</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${bookingDetails.flight.class}</td>
                            <td>${bookingDetails.flight.type}</td>
                            <td>${bookingDetails.flight.departing}</td>
                            <td>${bookingDetails.flight.arriving}</td>
                            <td>${bookingDetails.flight.duration}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="r4">
            <div class="bg-black">Passenger Details</div>
            <table>
                <thead>
                    <tr>
                        <th>Sr.</th>
                        <th>Name & FF</th>
                        <th>Sector</th>
                        <th>PNR & Ticket No.</th>
                        <th>Baggage Check-in | Cabin</th>
                        <th>Meal, Seat & Other Preference</th>
                        <th>Document Id</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookingDetails.passengers.map((passenger, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${passenger.name}</td>
                        <td>${passenger.sector}</td>
                        <td>${passenger.pnr} / ${passenger.ticketNumber}</td>
                        <td>${passenger.baggage}</td>
                        <td>${passenger.meal}</td>
                        <td>${passenger.documentId}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="r5">
            <div class="bg-black">Fare Details</div>
            <table style="border: 1px solid black; border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 2px 5px; border: none;">Base Price</td>
                    <td style="padding: 2px 5px; border: none;">${bookingDetails.basePrice}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 5px; border: none;">Airline Taxes and Fees</td>
                    <td style="padding: 2px 5px; border: none;">${bookingDetails.airlineTaxes}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 5px; border: none;">Management Fee</td>
                    <td style="padding: 2px 5px; border: none;">${bookingDetails.managementFee}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 5px; border: none;">Meal/ Seat/Baggage/ Misc Charges</td>
                    <td style="padding: 2px 5px; border: none;">${bookingDetails.mealFee}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 5px; border: none;">Baggage Protection Service Fee</td>
                    <td style="padding: 2px 5px; border: none;">${bookingDetails.baggageProtectionFee}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 5px; border: none;">Management Fee GST</td>
                    <td style="padding: 2px 5px; border: none;">${bookingDetails.gst}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 5px; border: none;">Total Price</td>
                    <td class="text-bold" style="padding: 2px 5px; border: none;">${bookingDetails.totalPrice}</td>
                </tr>
            </table>
        </div>
        <div class="r6">
            <div class="bg-black">Important Information</div>
            <ul>
                ${[
                    "You must web check-in on the airline website and obtain a boarding pass.",
                    "Reach the terminal at least 2 hours prior to the departure for domestic flight and 4 hours prior to the departure of international flight.",
                    "For departure terminal please check with the airline first.",
                    "Date & Time is calculated based on the local time of the city/destination.", 
                    "Use the Airline PNR for all Correspondence directly with the Airline",
                    "For rescheduling/cancellation within 4 hours of the departure time contact the airline directly",
                    "Your ability to travel is at the sole discretion of the airport authorities and we shall not be held responsible."
                ].map(info => `<li>${info}</li>`).join('')}
            </ul>
        </div>
    </body>
    </html>
    `
    
      return htmlContent;
    };
    
    module.exports = generatePlaneBookingHtml;
    