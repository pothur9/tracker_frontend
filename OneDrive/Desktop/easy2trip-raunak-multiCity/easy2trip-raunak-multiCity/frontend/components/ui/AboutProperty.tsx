import { Building } from 'lucide-react';

const highlights = [
  { 
    icon: "🌟", 
    title: "Perfect Location",
    description: "Prime spot with easy access to major attractions" 
  },
  { 
    icon: "🏊‍♂️", 
    title: "Top Amenities",
    description: "World-class facilities for a comfortable stay" 
  },
  { 
    icon: "🍽️", 
    title: "Dining Excellence",
    description: "Multiple dining options with 24/7 room service" 
  },
  { 
    icon: "🎯", 
    title: "Business Ready",
    description: "Modern workspaces and high-speed internet" 
  }
];

export const AboutProperty = ({ description }: { description: string }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle, #fff 1px, transparent 1px)] bg-[length:10px_10px]"></div>
        <div className="relative p-6 text-white">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            <h2 className="text-xl font-bold">About This Property</h2>
          </div>
          <p className="text-blue-50 text-sm mt-2">Discover your perfect stay with us</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {highlights.map((item, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6">
        <div className="prose prose-sm max-w-none text-gray-600 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};