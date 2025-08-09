import { useState } from 'react'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/hooks/useAuth'
import { MetricCard } from '@/components/ui/MetricCard'
import { AccountRow } from '@/components/ui/AccountRow'
import { TransactionRow } from '@/components/ui/TransactionRow'
import { ChartWrapper } from '@/components/ui/ChartWrapper'
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal'
import { AddAccountModal } from '@/components/dashboard/AddAccountModal'
import { BudgetOverview } from '@/components/dashboard/BudgetOverview'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'

export default function Overview() {
  const { user } = useAuth()
  const { accounts } = useAccounts(user?.id || '')
  const { transactions } = useTransactions(user?.id || '')
  const { categories } = useCategories(user?.id || '')

  const recentTransactions = transactions?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Financial Overview</h2>
        <div className="flex gap-2">
          <AddTransactionModal userId={user?.id || ''} />
          <AddAccountModal userId={user?.id || ''} />
        </div>
      </div>

      <SummaryCards accounts={accounts || []} transactions={transactions || []} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ChartWrapper title="Accounts">
            <div className="space-y-4">
              {accounts?.map((account) => (
                <AccountRow key={account.id} account={account} />
              ))}
            </div>
          </ChartWrapper>

          <BudgetOverview categories={categories || []} transactions={transactions || []} />
        </div>

        <div className="space-y-6">
          <SpendingChart transactions={transactions || []} />

          <ChartWrapper title="Recent Transactions">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </ChartWrapper>
        </div>
      </div>
    </div>
  )
}