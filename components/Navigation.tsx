'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Activity,
  BookOpen,
  FileText,
  User,
  LogOut,
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

  const navItems = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/dashboard/exercises`, label: t('workout'), icon: Activity },
    { href: `/${locale}/dashboard/books`, label: t('skill'), icon: BookOpen },
    { href: `/${locale}/dashboard/posts`, label: t('posts'), icon: FileText },
    { href: `/${locale}/dashboard/profile`, label: t('profile'), icon: User },
  ];

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
