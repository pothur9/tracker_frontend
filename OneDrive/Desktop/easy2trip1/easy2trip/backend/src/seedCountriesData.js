require("dotenv").config();
const mongoose = require("mongoose");
const connect = require("./config/db");
const Country = require("./models/country.model");
const countries = [
    { name: "Argentina", code: "AR", flag: "🇦🇷", visa_fees: 0, charges: 0 },
    { name: "Australia", code: "AU", flag: "🇦🇺", visa_fees: 11200, charges: 800 },
    { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", visa_fees: 2346, charges: 200 },
    { name: "Bahrain", code: "BH", flag: "🇧🇭", visa_fees: "6750 - 1 month, 4750 - 14 days, 12400 - 1 year multiple", charges: 200 },
    { name: "Brazil", code: "BR", flag: "🇧🇷", visa_fees: 0, charges: 0 },
    { name: "Cambodia", code: "KH", flag: "🇰🇭", visa_fees: 2710, charges: 140 },
    { name: "Canada", code: "CA", flag: "🇨🇦", visa_fees: 11800, charges: 800 },
    { name: "China", code: "CN", flag: "🇨🇳", visa_fees: 4806, charges: 700 },
    { name: "Dubai (UAE)", code: "AE", flag: "🇦🇪", visa_fees: 6600, charges: 200 },
    { name: "Egypt", code: "EG", flag: "🇪🇬", visa_fees: 2200, charges: 150 },
    { name: "Europe", code: "EU", flag: "🇪🇺", visa_fees: 8225 , charges: 600 },
    { name: "France", code: "FR", flag: "🇫🇷", visa_fees: 0, charges: 0 },
    { name: "Georgia", code: "GE", flag: "🇬🇪", visa_fees: 4200, charges: 200 },
    { name: "Germany", code: "DE", flag: "🇩🇪", visa_fees: 0, charges: 0 },
    { name: "Hong Kong", code: "HK", flag: "🇭🇰", visa_fees: "Nil", charges: 200 },
    { name: "India", code: "IN", flag: "🇮🇳", visa_fees: 0, charges: 0 },
    { name: "Indonesia", code: "ID", flag: "🇮🇩", visa_fees: 2960, charges: 200 },
    { name: "Italy", code: "IT", flag: "🇮🇹", visa_fees: 0, charges: 0 },
    { name: "Japan", code: "JP", flag: "🇯🇵", visa_fees: 1300, charges: 700 },
    { name: "Jordan", code: "JO", flag: "🇯🇴", visa_fees: 0, charges: 0 },
    { name: "Kenya", code: "KE", flag: "🇰🇪", visa_fees: 2700, charges: 250 },
    { name: "Kuwait", code: "KW", flag: "🇰🇼", visa_fees: 0, charges: 0 },
    { name: "Malaysia", code: "MY", flag: "🇲🇾", visa_fees: 0, charges: 0 },
    { name: "Maldives", code: "MV", flag: "🇲🇻", visa_fees: 0, charges: 0 },
    { name: "Mexico", code: "MX", flag: "🇲🇽", visa_fees: 0, charges: 0 },
    { name: "Morocco", code: "MA", flag: "🇲🇦", visa_fees: 0, charges: 0 },
    { name: "New Zealand", code: "NZ", flag: "🇳🇿", visa_fees: 24200, charges: 800 },
    { name: "Oman", code: "OM", flag: "🇴🇲", visa_fees: "2500 - 10 days, 5650 - 30 days", charges: 0 },
    { name: "Philippines", code: "PH", flag: "🇵🇭", visa_fees: 0, charges: 0 },
    { name: "Qatar", code: "QA", flag: "🇶🇦", visa_fees: "1200 - 30 days w/o ins, 2400 - 30 days w/ ins, 2500 - 10 days, 5650 - 30 days", charges: 0 },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", visa_fees: 0, charges: 0 },
    { name: "Singapore", code: "SG", flag: "🇸🇬", visa_fees: 2500, charges: 200 },
    { name: "South Africa", code: "ZA", flag: "🇿🇦", visa_fees: 2040, charges: 700 },
    { name: "South Korea", code: "KR", flag: "🇰🇷", visa_fees: 5130, charges: 700 },
    { name: "Spain", code: "ES", flag: "🇪🇸", visa_fees: 0, charges: 0 },
    { name: "Sri Lanka", code: "LK", flag: "🇱🇰", visa_fees: "Nil", charges: 200 },
    { name: "Switzerland", code: "CH", flag: "🇨🇭", visa_fees: 0, charges: 0 },
    { name: "Thailand", code: "TH", flag: "🇹🇭", visa_fees: 6350, charges: 200 },
    { name: "Turkey", code: "TR", flag: "🇹🇷", visa_fees: 0, charges: 0 },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧", visa_fees: 16085, charges: 700 },
    { name: "United States", code: "US", flag: "🇺🇸", visa_fees: 15540, charges: 800 },
    { name: "Vietnam", code: "VN", flag: "🇻🇳", visa_fees: 238, charges: 200 }
  ].sort((a, b) => a.name.localeCompare(b.name));


  const seedData = async () => {
    try{
      await connect()
      console.log("Connected to MongoDB")

      // clear existing country fata
      await Country.deleteMany({})
      console.log("Deleted existing data")

      // Insert thje new data
      await Country.insertMany(countries)
      console.log("Inserted new data")

    } catch(err){
      console.error(err)
    }
    finally{
      mongoose.connection.close()
    }
  }

  seedData();