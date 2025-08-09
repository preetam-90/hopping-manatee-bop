import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { BudgetOverview } from '@/components/dashboard/BudgetOverview'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal'
import { AccountsList } from '@/components/dashboard/AccountsList'
import { GoalTracker } from '@/components/dashboard/GoalTracker'
import { InvestmentTracker } from '@/components/dashboard/InvestmentTracker'
import { DebtTracker } from '@/components/dashboard/DebtTracker'
import { AdvancedFilters } from '@/components/dashboard/AdvancedFilters'
import { ExportReports } from '@/components/dashboard/ExportReports'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut, Wallet, AlertCircle, TrendingUp, Target, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Index() {
  const { user, signOut } = useAuth()
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(user?.id || '')
  const { transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(user?.id || '')
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(user?.id || '')
  const [activeTab, setActiveTab] = useState('overview')
  const [filteredTransactions, setFilteredTransactions] = useState(transactions || [])

  useEffect(() => {
    if (!user) return
    
    const channel = supabase.channel('transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        () => {
          // Real-time updates handled by React Query
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  useEffect(() => {
    setFilteredTransactions(transactions || [])
  }, [transactions])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      toast.success('Signed out successfully')
    }
  }

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Finance Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to access your financial data</p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isLoading = accountsLoading || transactionsLoading || categoriesLoading
  const hasError = accountsError || transactionsError || categoriesError

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Wallet className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold dark:text-white">Finance Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center flex-col">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2 dark:text-white">Error Loading Data</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                  {accountsError?.message || transactionsError?.message || categoriesError?.message}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold dark:text-white">Finance Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div>
            <p className="text-center mb-4 dark:text-white">Loading your financial data...</p>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
                <TabsTrigger value="debt">Debt</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">Financial Overview</h2>
                  <div className="flex gap-2">
                    <AddTransactionModal userId={user.id} />
                  </div>
                </div>

                <SummaryCards accounts={accounts || []} transactions={transactions || []} />
                
                <AdvancedFilters onFilterChange={handleFilterChange} />

                <div className="grid gap-6 lg:grid-cols-2">
                  <AccountsList userId={user.id} />
                  <SpendingChart transactions={filteredTransactions || []} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <BudgetOverview 
                    categories={categories || []} 
                    transactions={filteredTransactions || []} 
                  />
                  <TransactionList 
                    transactions={filteredTransactions || []} 
                    isLoading={transactionsLoading} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">All Transactions</h2>
                  <AddTransactionModal userId={user.id} />
                </div>
                
                <AdvancedFilters onFilterChange={handleFilterChange} />
                
                <TransactionList 
                  transactions={filteredTransactions || []} 
                  isLoading={transactionsLoading} 
                />
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Savings Goals</h2>
                <GoalTracker userId={user.id} />
              </TabsContent>

              <TabsContent value="investments" className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Investment Portfolio</h2>
                <InvestmentTracker userId={user.id} />
              </TabsContent>

              <TabsContent value="debt" className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Debt Management</h2>
                <DebtTracker userId={user.id} />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Reports & Export</h2>
                <ExportReports 
                  transactions={transactions || []} 
                  accounts={accounts || []}
                  categories={categories || []}
                />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Advanced Analytics</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                  <SpendingChart transactions={filteredTransactions || []} />
                  <BudgetOverview 
                    categories={categories || []} 
                    transactions={filteredTransactions || []} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}