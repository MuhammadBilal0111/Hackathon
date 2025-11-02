'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n-config';

export default function LanguageSwitcher() {
  const pathName = usePathname();
  const router = useRouter();

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div>
      <p>Locale switcher:</p>
      <ul>
        {i18n.locales.map(locale => {
          return (
            <li key={locale}>
              <button onClick={() => router.push(redirectedPathName(locale))}>
                {locale}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
