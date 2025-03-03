import { NearbyPlace } from '../types';

export const LocationMap = ({ 
  address,
  nearbyPlaces 
}: { 
  address: string;
  nearbyPlaces: NearbyPlace[];
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-[300px] relative">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`}
          className="border-0"
        ></iframe>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Nearby Places</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span>🚆</span> Transport
            </h4>
            <ul className="space-y-2">
              {nearbyPlaces
                .filter(place => place.type === 'Transport')
                .map((place, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{place.name}</span>
                    <span className="text-gray-400">({place.distance})</span>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <span>🏛️</span> Landmarks
            </h4>
            <ul className="space-y-2">
              {nearbyPlaces
                .filter(place => place.type === 'Landmarks')
                .map((place, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{place.name}</span>
                    <span className="text-gray-400">({place.distance})</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};