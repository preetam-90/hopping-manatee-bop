import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { Category } from '@/types/database'

interface BudgetOverviewProps {
  categories: Category[]
  transactions: any[]
}

export function BudgetOverview({ categories, transactions }: BudgetOverviewProps) {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })

  const categorySpending = categories.map(category => {
    const spent = monthlyTransactions
      .filter(t => t.category_id === category.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const budgetLimit = category.budget_limit || 0
    const percentage = budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0
    
    return {
      ...category,
      spent,
      budgetLimit,
      percentage,
    }
  }).filter(c => c.budgetLimit > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categorySpending.map((category) => (
            <div key={category.id}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(category.spent)} / {formatCurrency(category.budgetLimit)}
                </span>
              </div>
              <Progress 
                value={Math.min(category.percentage, 100)} 
                className={category.percentage > 100 ? 'bg-red-200' : ''}
              />
              {category.percentage > 100 && (
                <p className="text-xs text-red-600 mt-1">
                  Over budget by {formatCurrency(category.spent - category.budgetLimit)}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}