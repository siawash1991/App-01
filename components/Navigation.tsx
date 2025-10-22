'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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
  Dumbbell,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { data: session } = useSession();
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const navItems = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/dashboard/workout`, label: t('workout'), icon: Dumbbell },
    { href: `/${locale}/dashboard/exercises`, label: t('workout'), icon: Activity },
    { href: `/${locale}/dashboard/posts`, label: t('posts'), icon: FileText },
    { href: `/${locale}/dashboard/profile`, label: t('profile'), icon: User },
  ];

  const skillItems = [
    { href: `/${locale}/dashboard/skill/books`, label: t('skill_books'), icon: BookOpen },
    { href: `/${locale}/dashboard/skill/podcasts`, label: t('skill_podcasts'), icon: Headphones },
    { href: `/${locale}/dashboard/skill/documentaries`, label: t('skill_documentaries'), icon: Film },
    { href: `/${locale}/dashboard/skill/analytics`, label: t('skill_analytics'), icon: TrendingUp },
  ];

  const isSkillActive = pathname.startsWith(`/${locale}/dashboard/skill`);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <Link
              href={`/${locale}/dashboard`}
              className="text-2xl font-bold text-blue-600"
            >
              {tCommon('app_name')}
            </Link>
            <div className="hidden md:flex space-x-4 rtl:space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition',
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
                    'flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition',
                    isSkillActive
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <BookOpen size={18} />
                  <span>{t('skill')}</span>
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
                            'flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 transition',
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
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
