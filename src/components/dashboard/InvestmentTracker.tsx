import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Home, Briefcase, MoreVertical } from 'lucide-react'
import { useInvestments } from '@/hooks/useInvestments'
import { AddInvestmentModal } from './AddInvestmentModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface InvestmentTrackerProps {
  userId: string
}

const investmentIcons = {
  stocks: <TrendingUp className="w-5 h-5" />,
  crypto: <Bitcoin className="w-5 h-5" />,
  'real-estate': <Home className="w-5 h-5" />,
  'mutual-fund': <Briefcase className="w-5 h-5" />,
  bonds: <DollarSign className="w-5 h-5" />,
  other: <DollarSign className="w-5 h-5" />
}

export function InvestmentTracker({ userId }: InvestmentTrackerProps) {
  const { investments, isLoading, deleteInvestment } = useInvestments(userId)

  const handleDeleteInvestment = async (investmentId: string, investmentName: string) => {
    if (window.confirm(`Are you sure you want to delete "${investmentName}"?`)) {
      try {
        await deleteInvestment.mutateAsync(investmentId)
        toast.success('Investment deleted successfully')
      } catch (error) {
        toast.error('Failed to delete investment')
      }
    }
  }

  const totalValue = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0
  const totalInvested = investments?.reduce((sum, inv) => sum + inv.invested_amount, 0) || 0
  const totalGainLoss = totalValue - totalInvested
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investment Portfolio</CardTitle>
        <AddInvestmentModal userId={userId} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-lg">{formatCurrency(totalInvested)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
              <p className={`text-lg font-semibold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)} ({totalGainLossPercent.toFixed(1)}%)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {investments?.map((investment) => {
              const change = investment.current_value - investment.invested_amount
              const changePercent = investment.invested_amount > 0 ? (change / investment.invested_amount) * 100 : 0

              return (
                <div key={investment.id} className="relative flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {investmentIcons[investment.type]}
                    </div>
                    <div>
                      <p className="font-medium">{investment.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {investment.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(investment.current_value)}</p>
                    <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '+' : ''}{formatCurrency(change)} ({changePercent.toFixed(1)}%)
                    </p>
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
                        onClick={() => handleDeleteInvestment(investment.id, investment.name)}
                      >
                        Delete Investment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>

          {investments?.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No investments tracked yet</p>
              <AddInvestmentModal userId={userId} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}