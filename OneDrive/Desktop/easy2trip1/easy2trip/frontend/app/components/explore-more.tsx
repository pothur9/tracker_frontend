import { ChevronDown } from "lucide-react";
import Image from "next/image";

export function ExploreMore() {
  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-2 text-red-600 mb-4 sm:mb-6">
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium">Explore More</span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {[
          { title: "Where2Go", desc: "" },
          { title: "How2Go", desc: "Find routes to anywhere", badge: "new" },
          { title: "easy2trip ICICI Credit Card", desc: "Never-expiring rewards & big benefits" },
          { title: "MICE", desc: "Offsites, Events & Meetings" },
          { title: "Gift Cards", desc: "" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <Image 
              src="/placeholder.svg" 
              alt={item.title} 
              width={40} 
              height={40} 
              className="w-8 h-8 sm:w-10 sm:h-10" 
            />
            <div className="text-left flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <span className="bg-red-100 text-red-600 text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.desc && (
                <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                  {item.desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
