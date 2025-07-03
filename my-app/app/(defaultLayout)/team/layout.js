'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeamLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/team/members', label: 'Members' },
    { href: '/team/tasks',   label: 'Tasks'   },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white shadow">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-6 py-4">
            {navItems.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
