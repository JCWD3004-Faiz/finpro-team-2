import React, { useEffect, useState } from 'react';
import { User, MapPin, Ticket, Package, History, Settings, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '@/redux/slices/userProfileSlice';
import Skeleton from 'react-loading-skeleton';
import { cn } from "@/lib/utils";
import { RootState, AppDispatch } from '@/redux/store';
import useAuth from '@/hooks/useAuth';

const navigationItems = [
  { label: "Edit Profile", icon: Settings, href: "/user/profile-editor" },
  { label: "Addresses", icon: MapPin, href: "/user/addresses" },
  { label: "Vouchers", icon: Ticket, href: "/user/vouchers" },
  { label: "Ongoing Orders", icon: Package, href: "/user/orders" },
  { label: "Transaction History", icon: History, href: "/user/history" },
];

export function UserSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { username, email, image, loading } = useSelector(
    (state: RootState) => state.userProfile
  );

  const user = useAuth();
  const user_id = Number(user?.id);

  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    if (user_id) {
      dispatch(fetchProfile(user_id));
    }
  }, [user_id, dispatch]);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white rounded-lg p-4"
        style={{ boxShadow: '0 -1px 6px rgba(0, 0, 0, 0.1), 0 4px 3px rgba(0, 0, 0, 0.08)' }}>
        <div className="flex flex-col items-center pb-6 border-b">
          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-muted">
            {loading ? (
              <Skeleton circle={true} height={96} width={96} />
            ) : image ? (
              <Image
                src={image}
                alt={username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <User className="w-12 h-12 text-primary/40" />
              </div>
            )}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {loading ? <Skeleton width={120} /> : username}
          </p>
          <p className="text-sm text-muted-foreground">
            {loading ? <Skeleton width={150} /> : email}
          </p>
        </div>

        <nav className="mt-6 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-800 flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary transition-colors"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 left-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Toggle profile menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-xl p-4 transition-transform duration-300 ease-in-out transform",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex flex-col items-center pb-6 border-b">
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-muted">
              {loading ? (
                <Skeleton circle={true} height={96} width={96} />
              ) : image ? (
                <Image
                  src={image}
                  alt={username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="w-12 h-12 text-primary/40" />
                </div>
              )}
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {loading ? <Skeleton width={120} /> : username}
            </p>
            <p className="text-sm text-muted-foreground">
              {loading ? <Skeleton width={150} /> : email}
            </p>
          </div>

          <nav className="mt-6 space-y-1 pb-16">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-800 flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
