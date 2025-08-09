import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, Home, Car, GraduationCap, MoreVertical } from 'lucide-react'
import { useDebts } from '@/hooks/useDebts'
import { AddDebtModal } from './AddDebtModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface DebtTrackerProps {
  userId: string
}

const debtIcons = {
  'credit-card': <CreditCard className="w-5 h-5" />,
  'mortgage': <Home className="w-5 h-5" />,
  'auto-loan': <Car className="w-5 h-5" />,
  'student-loan': <GraduationCap className="w-5 h-5" />,
  'personal-loan': <CreditCard className="w-5 h-5" />,
  'other': <CreditCard className="w-5 h-5" />
}

export function DebtTracker({ userId }: DebtTrackerProps) {
  const { debts, isLoading, deleteDebt } = useDebts(userId)

  const handleDeleteDebt = async (debtId: string, debtName: string) => {
    if (window.confirm(`Are you sure you want to delete "${debtName}"?`)) {
      try {
        await deleteDebt.mutateAsync(debtId)
        toast.success('Debt deleted successfully')
      } catch (error) {
        toast.error('Failed to delete debt')
      }
    }
  }

  const totalDebt = debts?.reduce((sum, debt) => sum + debt.current_balance, 0) || 0
  const totalOriginal = debts?.reduce((sum, debt) => sum + debt.original_amount, 0) || 0
  const totalPaid = totalOriginal - totalDebt
  const overallProgress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debt Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Debt Overview</CardTitle>
        <AddDebtModal userId={userId} />
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
            {debts?.map((debt) => {
              const progress = ((debt.original_amount - debt.current_balance) / debt.original_amount) * 100
              
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
                      <p className="font-semibold">{formatCurrency(debt.current_balance)}</p>
                      <p className="text-xs text-muted-foreground">{debt.interest_rate}% APR</p>
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
                    <span>Payment: {formatCurrency(debt.monthly_payment)}/mo</span>
                    {debt.next_payment_date && <span>Next: {debt.next_payment_date}</span>}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="absolute top-2 right-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteDebt(debt.id, debt.name)}
                      >
                        Delete Debt
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>

          {debts?.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No debts tracked yet</p>
              <AddDebtModal userId={userId} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}