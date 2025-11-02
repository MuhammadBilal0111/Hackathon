'use client';

import { Cloud, Droplets, Wind } from 'lucide-react';
import { useLocalization } from '@/lib/localization';

export function WeatherCard() {
  const { t } = useLocalization();

  return (
    <div className="bg-gradient-to-br from-green-100 via-white to-green-200 rounded-xl p-6 shadow-lg border border-green-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-2">
            <Cloud className="inline w-4 h-4 text-green-500" /> {t('weather')}
          </p>
          <p className="text-xs text-green-600 mb-4">{t('location')}</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shadow-md">
          <Cloud className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-5xl font-bold text-green-700 flex items-center gap-2">
            22°C <span className="text-2xl">🌤️</span>
          </p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <Cloud className="inline w-4 h-4 text-green-400" /> {t('partlyCloudy')}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center shadow-inner">
            <Droplets className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-700 mt-2">{t('humidity')}</p>
          <p className="text-sm font-bold text-green-900">65%</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center shadow-inner">
            <Wind className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-700 mt-2">{t('wind')}</p>
          <p className="text-sm font-bold text-green-900">8 km/h</p>
        </div>
      </div>
      {/* Additional details or forecast can be added here for more visuals */}
    </div>
  );
}
