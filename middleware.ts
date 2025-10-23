import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales: locales,
  defaultLocale: 'fa',
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/',
    '/(fa|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
