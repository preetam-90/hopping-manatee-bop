import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AddDebtModal } from '@/components/dashboard/AddDebtModal'

interface Debt {
  id: string
  name: string
  type: string
  originalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  nextPaymentDate: string
}

export default function Debt() {
  const { user } = useAuth()
  const [debts] = useState<Debt[]>([
    {
      id: '1',
      name: 'Credit Card',
      type: 'Credit Card',
      originalAmount: 5000,
      currentBalance: 3200,
      interestRate: 18.5,
      monthlyPayment: 150,
      nextPaymentDate: '2024-02-15'
    },
    {
      id: '2',
      name: 'Car Loan',
      type: 'Auto Loan',
      originalAmount: 25000,
      currentBalance: 18000,
      interestRate: 5.9,
      monthlyPayment: 450,
      nextPaymentDate: '2024-02-20'
    }
  ])

  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0)
  const totalOriginal = debts.reduce((sum, debt) => sum + debt.originalAmount, 0)
  const totalPaid = totalOriginal - totalDebt
  const overallProgress = (totalPaid / totalOriginal) * 100

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Debt Management</h2>
        <AddDebtModal userId={user?.id || ''} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Debt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebt)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {debts.map((debt) => {
          const progress = ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100
          
          return (
            <Card key={debt.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {debt.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Current Balance</span>
                      <span className="font-semibold">{formatCurrency(debt.currentBalance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Original Amount</span>
                      <span>{formatCurrency(debt.originalAmount)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Interest Rate</span>
                      <span>{debt.interestRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Payment</span>
                      <span>{formatCurrency(debt.monthlyPayment)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="mt-2" />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Next payment: {new Date(debt.nextPaymentDate).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Make Payment
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Extra Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}