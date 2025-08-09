import { Outlet } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
import { NavTabs } from '@/components/ui/NavTabs'
import { useAuth } from '@/hooks/useAuth'

export function Shell() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header userEmail={user.email} />
      <NavTabs />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}