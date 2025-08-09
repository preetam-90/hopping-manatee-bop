import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'overview', label: 'Overview', path: '/' },
  { id: 'transactions', label: 'Transactions', path: '/transactions' },
  { id: 'goals', label: 'Goals', path: '/goals' },
  { id: 'investments', label: 'Investments', path: '/investments' },
  { id: 'debt', label: 'Debt', path: '/debt' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'analytics', label: 'Analytics', path: '/analytics' },
]

export function NavTabs() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                location.pathname === tab.path
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}