'use client';
import { Calendar } from 'lucide-react';
import { useLocalization } from '@/lib/localization';

export function UpcomingActivitiesCard() {
  const { t } = useLocalization();

  const activities = [
    {
      task: t('harvestWheat'),
      date: '2024-12-15',
      status: 'scheduled',
      icon: '🚜',
    },
    {
      task: t('sprayPesticides'),
      date: '2024-12-08',
      status: 'pending',
      icon: '💨',
    },
    {
      task: t('soilTesting'),
      date: '2024-12-20',
      status: 'scheduled',
      icon: '🧪',
    },
  ];

  const getStatusColor = (status: string) => {
    return status === 'pending' ? 'text-red-500' : 'text-accent';
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
            {t('upcomingActivities')}
          </p>
          <h3 className="text-2xl font-bold text-foreground">
            {t('annualPlan')}
          </h3>
        </div>
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
      </div>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="p-4 bg-secondary/50 rounded-lg border border-border/30 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0 mt-0.5">{activity.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-foreground">
                    {activity.task}
                  </p>
                  <span
                    className={`text-xs font-bold ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status === 'pending'
                      ? t('urgent')
                      : t('scheduled')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
