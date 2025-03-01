import pandas as pd
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb+srv://makrand:dBOBKvCWDawEwEQB@cluster0.6bi82nh.mongodb.net/")  # Replace with your MongoDB URI if needed
db = client['easytrip']  # Replace with your database name
collection = db['airports']  # Replace with your collection name

# Read the Excel file
csv_file = "updatedAirport1.csv"  # File is in the same directory as the script
df = pd.read_csv(csv_file)

# Convert DataFrame to dictionary records
records = df.to_dict(orient='records')

# Insert records into MongoDB
result = collection.insert_many(records)
print(f"Inserted {len(result.inserted_ids)} documents into MongoDB.")
