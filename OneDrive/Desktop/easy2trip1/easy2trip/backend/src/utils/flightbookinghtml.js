const sendBookingConfirmation = ({ from, to, subject, bookingDetails }) => {
  const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Easy2Trip Booking Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg,rgb(128, 0, 0),rgb(230, 0, 0));
            color: white;
            padding: 20px;
            text-align: center;
            border-bottom-left-radius: 50% 20px;
            border-bottom-right-radius: 50% 20px;
        }
        .flightheader img {
            width: 100%;
            height: auto;
            display: block;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header h2 {
            margin: 10px 0;
            font-size: 20px;
        }
        .header p {
            margin: 5px 0;
        }
        .header img {
            width: 100%;
            margin: 20px 0 0;
        }
        .section {
            padding: 20px;
            border-bottom: 1px solid #ddd;
        }
        .section:last-child {
            border-bottom: none;
        }
        .section-title {
            background: linear-gradient(135deg,rgb(128, 0, 0),rgb(230, 0, 0));
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        .details-horizontal {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .details-horizontal div {
            width: 48%;
        }
        .details strong {
            color: #004080;
        }
        .divider {
            border-top: 1px solid #ddd;
            margin: 15px 0;
        }
        .cost-summary .details {
            font-weight: bold;
        }
        .key-notes {
            background-color: #e6f2ff;
            padding: 15px;
            border-radius: 10px;
            font-size: 14px;
            margin: 20px;
        }
        a {
            color:rgb(255, 255, 255);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Easy2Trip Booking Confirmation</h1>
            <h2>Flight Booking Confirmation</h2>
            <p><strong>Booking Date:</strong> Sunday, February 02, 2025</p>
         
          
            <p>Email: <a href="mailto:sales@easy2trip.com">sales@easy2trip.com</a></p>
            <p>Phone: 9742555514</p>
         
        </div>
          <div class="flightheader">
         <img src="/images/sample.jpg" alt="Airplane Image">
        </div>
        <div class="section">
            <div class="section-title">Route</div>
            <div class="details-horizontal">
                <div><strong>From:</strong> Mumbai</div>
                <div><strong>Airline:</strong> Air-India</div>
            </div>
            <div class="details-horizontal">
                <div><strong>Departure Date:</strong> Feburary 02, 2023, 07:15</div>
                <div><strong>Departure Terminal:</strong> Terminal 2</div>
            </div>

            <div class="divider"></div>

            <div class="details-horizontal">
                <div><strong>To:</strong> Goa</div>
                <div><strong>Flight No.:</strong> AB1234</div>
            </div>
            <div class="details-horizontal">
                <div><strong>Arrival Date:</strong> Feburary 02, 2023, 08:15</div>
                <div><strong>Arrival Terminal:</strong> Terminal 1</div>
            </div>
        </div>
        <div class="section">
            <div class="section-title">Passanger Information</div>
            <div class="details"><strong>Name:</strong> Makrand Dessai</div>
            <div class="details"><strong>Email:</strong> makrand@gmail.com</div>
            <div class="details"><strong>PNR:</strong> 5B3T2</div>
            <div class="details"><strong>Class:</strong> Premium Economy</div>
            <div class="details"><strong>Extra Luggage:</strong> 7 pieces</div>
            <div class="details"><strong>Seat Assignment:</strong> 5B</div>
        </div>

        

        <div class="section">
            <div class="section-title">Cost Summary</div>
            <div class="details"><span>Ticket Price:</span><span>₹ 150</span></div>
            <div class="details"><span>Airport Tax:</span><span>₹10</span></div>
            <div class="details"><span>Additional Charges:</span><span>₹65</span></div>
            <div class="details"><span>Fuel & Insurance:</span><span>₹25</span></div>
            <div class="details"><span>Booking Fee:</span><span>₹5</span></div>
            <div class="details"><strong>Total Amount:</strong><strong>₹255</strong></div>
        </div>

        <div class="key-notes">
            <strong>Key Notes:</strong>
            <p>Please bring this confirmation, along with a government-issued photo ID, upon check-in.</p>
        </div>
    </div>
</body>
</html>
`;

  return htmlContent;
};

module.exports = sendBookingConfirmation;
