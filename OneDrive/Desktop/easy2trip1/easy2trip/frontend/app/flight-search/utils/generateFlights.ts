export const generateFlights = () => {
  const airlines = [
    { name: "IndiGo", code: "6E", logo: "/placeholder.svg" },
    { name: "Air India", code: "AI", logo: "/placeholder.svg" },
    { name: "SpiceJet", code: "SG", logo: "/placeholder.svg" },
    { name: "Vistara", code: "UK", logo: "/placeholder.svg" },
    { name: "GoAir", code: "G8", logo: "/placeholder.svg" },
    { name: "AirAsia India", code: "I5", logo: "/placeholder.svg" },
  ];

  const times = [
    { dep: "06:10", arr: "07:50", duration: "01h 40m" },
    { dep: "08:30", arr: "10:10", duration: "01h 40m" },
    { dep: "11:45", arr: "13:25", duration: "01h 40m" },
    { dep: "14:20", arr: "16:00", duration: "01h 40m" },
    { dep: "17:35", arr: "19:15", duration: "01h 40m" },
    { dep: "20:00", arr: "21:40", duration: "01h 40m" },
    { dep: "22:15", arr: "23:55", duration: "01h 40m" },
  ];

  return Array(25)
    .fill(null)
    .map((_, index) => {
      const airline = airlines[index % airlines.length];
      const time = times[index % times.length];
      const basePrice = 6000 + Math.floor(Math.random() * 6000);

      return {
        id: index + 1,
        airline: airline.name,
        flightNumber: `${airline.code} ${5000 + index}`,
        departureTime: time.dep,
        arrivalTime: time.arr,
        duration: time.duration,
        price: basePrice,
        type: index % 3 === 0 ? "1 stop" : "Non stop",
        onTime: `${90 + Math.floor(Math.random() * 10)}%`,
        meal: index % 4 === 0,
        logo: airline.logo,
        seats: Math.floor(Math.random() * 30) + 1,
        baggage: "15 kg",
        handBaggage: "7 kg",
        cancellationFee: `₹ ${3000 + Math.floor(Math.random() * 1500)}`,
        offers: [
          "Use code MMTSUPER for extra ₹ 200 off",
          "Get up to ₹ 500 cashback with easy2trip wallet",
          "Get up to ₹ 1000 off with HDFC Bank credit card",
        ].slice(0, Math.floor(Math.random() * 3) + 1),
      };
    });
};
