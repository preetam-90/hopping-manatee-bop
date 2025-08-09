import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, Home, Car, GraduationCap } from 'lucide-react'

interface Debt {
  id: string
  name: string
  type: 'credit-card' | 'mortgage' | 'auto-loan' | 'student-loan' | 'personal-loan'
  originalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  nextPaymentDate: string
  remainingPayments: number
}

interface DebtTrackerProps {
  userId: string
}

const debtIcons = {
  'credit-card': <CreditCard className="w-5 h-5" />,
  'mortgage': <Home className="w-5 h-5" />,
  'auto-loan': <Car className="w-5 h-5" />,
  'student-loan': <GraduationCap className="w-5 h-5" />,
  'personal-loan': <CreditCard className="w-5 h-5" />
}

export function DebtTracker({ userId }: DebtTrackerProps) {
  const [debts] = useState<Debt[]>([
    {
      id: '1',
      name: 'Credit Card - Chase',
      type: 'credit-card',
      originalAmount: 5000,
      currentBalance: 2500,
      interestRate: 18.5,
      monthlyPayment: 200,
      nextPaymentDate: '2024-02-15',
      remainingPayments: 15
    },
    {
      id: '2',
      name: 'Auto Loan - Honda',
      type: 'auto-loan',
      originalAmount: 25000,
      currentBalance: 18000,
      interestRate: 4.5,
      monthlyPayment: 450,
      nextPaymentDate: '2024-02-20',
      remainingPayments: 45
    }
  ])

  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0)
  const totalOriginal = debts.reduce((sum, debt) => sum + debt.originalAmount, 0)
  const totalPaid = totalOriginal - totalDebt
  const overallProgress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debt Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Debt</p>
              <p className="text-xl font-bold">{formatCurrency(totalDebt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-lg text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-lg font-semibold">{overallProgress.toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-3">
            {debts.map((debt) => {
              const progress = ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100
              
              return (
                <div key={debt.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-red-100 rounded-full">
                        {debtIcons[debt.type]}
                      </div>
                      <div>
                        <p className="font-medium">{debt.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {debt.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(debt.currentBalance)}</p>
                      <p className="text-xs text-muted-foreground">{debt.interestRate}% APR</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Payment: {formatCurrency(debt.monthlyPayment)}/mo</span>
                    <span>Next: {debt.nextPaymentDate}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {debts.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No debts tracked yet</p>
              <Button>Add Debt</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}