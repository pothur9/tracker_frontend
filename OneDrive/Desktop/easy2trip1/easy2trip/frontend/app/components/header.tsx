"use client";

import { ChevronDown, User, Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="py-2 sm:py-4 border-b">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/easy2trip.png"
              alt="MakeMyTrip"
              width={120}
              height={36}
              className="h-8 sm:h-9 w-auto"
            />
          </Link>
          {/* Center Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* <Button 
              variant="ghost" 
              className="text-black text-sm gap-2 hover:bg-red-50 hover:text-red-600"
            >
              <Image 
                src="/homr.png" 
                alt="Property" 
                width={50} 
                height={50} 
                className="w-8 h-8 lg:w-10 lg:h-10" 
              />
              <div className="text-left">
                <div className="font-medium">List Your Property</div>
                <div className="text-xs opacity-80">Grow your business!</div>
              </div>
            </Button> */}

            {/* <Button
              variant="ghost"
              className="text-black text-sm gap-2 hover:bg-red-50 hover:text-red-600"
            >
              <Image
                src="/rb.png"
                alt="myBiz"
                width={20}
                height={20}
                className="w-8 h-8 lg:w-10 lg:h-10"
              />
              <div className="text-left">
                <div className="font-medium">Introducing myBiz</div>
                <div className="text-xs opacity-80">
                  Business Travel Solution
                </div>
              </div>
            </Button> */}
          </div>

          {/* Right Navigation - Hidden on Mobile */}
          {/* <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              className="text-black text-sm gap-1 hover:bg-red-50 hover:text-red-600"
            >
              <Image
                src="/rb2.png"
                alt="Trips"
                width={16}
                height={16}
                className="w-8 h-8 lg:w-10 lg:h-10"
              />
              My Trips
              <ChevronDown className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              className="text-black text-sm gap-1 hover:bg-red-50 hover:text-red-600"
            >
              <div className="w-5 h-5 rounded-full bg-red-300 flex items-center justify-center text-xs">
                T
              </div>
              Hi Traveller
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div> */}

          {/* Mobile Menu Button */}
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] overflow-y-auto"
            >
              
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
         
                <div className="flex flex-col gap-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm gap-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <Image
                      src="/homr.png"
                      alt="Property"
                      width={50}
                      height={50}
                      className="w-8 h-8"
                    />
                    <div className="text-left">
                      <div className="font-medium">List Your Property</div>
                      <div className="text-xs opacity-80">
                        Grow your business!
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm gap-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <Image
                      src="/rb.png"
                      alt="myBiz"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                    <div className="text-left">
                      <div className="font-medium">Introducing myBiz</div>
                      <div className="text-xs opacity-80">
                        Business Travel Solution
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm gap-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <Image
                      src="/rb2.png"
                      alt="Trips"
                      width={16}
                      height={16}
                      className="w-8 h-8"
                    />
                    <div className="text-left">
                      <div className="font-medium">My Trips</div>
                      <div className="text-xs opacity-80">
                        View & manage trips
                      </div>
                    </div>
                  </Button>

                  <hr className="my-2" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm gap-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-300 flex items-center justify-center text-xs">
                      T
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Hi Traveller</div>
                      <div className="text-xs opacity-80">
                        Account & Settings
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet> */}
        </div>
      </div>
    </header>
  );
}
