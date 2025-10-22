import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('hero_title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('hero_subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/${locale}/register`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {t('get_started')}
            </Link>
            <Link
              href={`/${locale}/login`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              {t('sign_in')}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Activity className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('features.exercise_title')}</h3>
            <p className="text-gray-600">
              {t('features.exercise_desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('features.reading_title')}</h3>
            <p className="text-gray-600">
              {t('features.reading_desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('features.posts_title')}</h3>
            <p className="text-gray-600">
              {t('features.posts_desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('features.profile_title')}</h3>
            <p className="text-gray-600">
              {t('features.profile_desc')}
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">{t('why_choose.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('why_choose.free_title')}</div>
              <p className="text-gray-600">{t('why_choose.free_desc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('why_choose.available_title')}</div>
              <p className="text-gray-600">{t('why_choose.available_desc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('why_choose.unlimited_title')}</div>
              <p className="text-gray-600">{t('why_choose.unlimited_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
