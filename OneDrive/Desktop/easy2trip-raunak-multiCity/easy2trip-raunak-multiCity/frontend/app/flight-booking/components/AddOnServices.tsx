// app/flight-booking/components/AddOnServices.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BadgeCheck, Timer } from "lucide-react";

interface AddOnServicesProps {
  onAddService: (service: string) => void;
}

export function AddOnServices({ onAddService }: AddOnServicesProps) {
  return (
    <div className="space-y-4">
      {/* Fast Forward Service */}
      {/* <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg p-2">
            <Image
              src="/airlines/indigo-fast-forward.png"
              alt="IndiGo Fast Forward"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">IndiGo Fast Forward</h3>
                <p className="text-sm text-gray-600 mt-1">
                  A service that provides you a hassle free and comfortable check-in experience at the airport with our priority check-in counter.
                </p>
              </div>
              <Button variant="outline" onClick={() => onAddService("fast-forward")}>
                + ADD
              </Button>
            </div>
            
            <div className="flex items-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Priority Check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Any Time Boarding</span>
              </div>
              <div className="font-medium">
                = ₹500
              </div>
            </div>

            <div className="mt-4 text-sm text-green-600">
              Apply code: PRIORITYCHECKIN to get 250 OFF on Fast Forward
            </div>
          </div>
        </div>
      </Card> */}

      {/* Price Lock */}
      {/* <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🔒</div>
            <div>
              <h3 className="font-medium">Still unsure about this trip?</h3>
              <p className="text-blue-600 font-medium">Lock this price!</p>
            </div>
          </div>
          <Button variant="outline" className="text-blue-600">
            LOCK NOW
          </Button>
        </div>
      </Card> */}

      {/* Excess Baggage */}
      {/* <Card className="p-6 bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🧳</div>
            <div>
              <h3 className="font-medium">Got excess baggage?</h3>
              <p className="text-blue-600">
                Don't stress, buy extra check-in baggage allowance for CCU-JAI
                at fab rates!
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            ADD BAGGAGE
          </Button>
        </div>
      </Card> */}
    </div>
  );
}
