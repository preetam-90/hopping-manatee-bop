import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { BudgetOverview } from '@/components/dashboard/BudgetOverview'
import { MetricCard } from '@/components/ui/MetricCard'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function Analytics() {
  const { user } = useAuth()
  const { transactions } = useTransactions(user?.id || '')
  const { categories } = useCategories(user?.id || '')

  const totalIncome = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
  const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
  const avgDailySpend = totalExpenses / 30
  const topCategory = categories?.[0]?.name || 'N/A'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Advanced Analytics</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Average Daily Spend"
          value={formatCurrency(avgDailySpend)}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          title="Top Category"
          value={topCategory}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Monthly Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Monthly Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="w-4 h-4" />}
          trend={{ value: 8.2, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart transactions={transactions || []} />
        <BudgetOverview 
          categories={categories || []} 
          transactions={transactions || []} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 You spent 23% more on dining this month compared to last month. Consider setting a dining budget.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                📈 Your savings rate has improved by 15% this quarter. Keep it up!
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ You have 3 subscriptions totaling $47/month that haven't been used recently.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}