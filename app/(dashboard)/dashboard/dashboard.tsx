'use client';

import { PendingTasksCard } from './pending-tasks-card';
import { CompletedTasksCard } from './completed-tasks-card';
import { WeatherCard } from './weather-card';
import { CropsCard } from './crops-card';
import { UpcomingActivitiesCard } from './upcoming-activities-card';
import { useLocalization } from '@/lib/localization';

export function Dashboard() {
  const { t } = useLocalization();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="flex-1">
        {/* Dashboard Grid */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('welcomeBack')}
            </h2>
            <p className="text-muted-foreground">{t('farmOverview')}</p>
          </div>

          <div className="space-y-6">
            {/* Row 1: Pending & Completed Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PendingTasksCard />
              <CompletedTasksCard />
            </div>

            {/* Row 2: Weather */}
            <div>
              <WeatherCard />
            </div>

            {/* Row 3: Crops & Upcoming Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CropsCard />
              <UpcomingActivitiesCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
