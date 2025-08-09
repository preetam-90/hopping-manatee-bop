import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionRow } from '@/components/ui/TransactionRow'
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal'
import { AdvancedFilters } from '@/components/dashboard/AdvancedFilters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Transactions() {
  const { user } = useAuth()
  const { transactions } = useTransactions(user?.id || '')
  const [filteredTransactions, setFilteredTransactions] = useState(transactions || [])

  const handleFilterChange = (filters: any) => {
    let filtered = transactions || []
    
    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= filters.dateRange.from && transactionDate <= filters.dateRange.to
      })
    }
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(t => t.category?.name?.toLowerCase() === filters.category)
    }
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type)
    }
    
    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= filters.amountMin)
    }
    
    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= filters.amountMax)
    }
    
    setFilteredTransactions(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">All Transactions</h2>
        <AddTransactionModal userId={user?.id || ''} />
      </div>

      <AdvancedFilters onFilterChange={handleFilterChange} />

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}