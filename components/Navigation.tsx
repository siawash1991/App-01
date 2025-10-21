'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  BookOpen,
  Headphones,
  Film,
  TrendingUp,
  FileText,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/exercises', label: 'Exercises', icon: Activity },
  { href: '/dashboard/posts', label: 'Posts', icon: FileText },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const skillItems = [
  { href: '/dashboard/skill/books', label: 'کتاب‌ها', icon: BookOpen },
  { href: '/dashboard/skill/podcasts', label: 'پادکست‌ها', icon: Headphones },
  { href: '/dashboard/skill/documentaries', label: 'مستندها', icon: Film },
  { href: '/dashboard/skill/analytics', label: 'آنالیز', icon: TrendingUp },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const isSkillActive = pathname.startsWith('/dashboard/skill');

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              ProductivityApp
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition',
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Skill Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                  onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition',
                    isSkillActive
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <BookOpen size={18} />
                  <span>Skill Development</span>
                  <ChevronDown size={16} className={cn(
                    'transition-transform',
                    showSkillDropdown ? 'rotate-180' : ''
                  )} />
                </button>

                {showSkillDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {skillItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center space-x-2 px-4 py-2 transition',
                            isActive
                              ? 'bg-green-50 text-green-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
