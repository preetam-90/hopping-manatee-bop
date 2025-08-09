import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Home, Briefcase } from 'lucide-react'

interface Investment {
  id: string
  name: string
  type: 'stocks' | 'crypto' | 'real-estate' | 'mutual-fund' | 'bonds'
  currentValue: number
  investedAmount: number
  change: number
  changePercent: number
}

interface InvestmentTrackerProps {
  userId: string
}

const investmentIcons = {
  stocks: <TrendingUp className="w-5 h-5" />,
  crypto: <Bitcoin className="w-5 h-5" />,
  'real-estate': <Home className="w-5 h-5" />,
  'mutual-fund': <Briefcase className="w-5 h-5" />,
  bonds: <DollarSign className="w-5 h-5" />
}

export function InvestmentTracker({ userId }: InvestmentTrackerProps) {
  const [investments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Tech Stock Portfolio',
      type: 'stocks',
      currentValue: 15000,
      investedAmount: 12000,
      change: 3000,
      changePercent: 25
    },
    {
      id: '2',
      name: 'Bitcoin',
      type: 'crypto',
      currentValue: 8000,
      investedAmount: 10000,
      change: -2000,
      changePercent: -20
    },
    {
      id: '3',
      name: 'Real Estate Fund',
      type: 'real-estate',
      currentValue: 25000,
      investedAmount: 20000,
      change: 5000,
      changePercent: 25
    }
  ])

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0)
  const totalGainLoss = totalValue - totalInvested
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Portfolio</CardTitle>
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
            {investments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                  <p className="font-semibold">{formatCurrency(investment.currentValue)}</p>
                  <p className={`text-sm ${investment.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {investment.change >= 0 ? '+' : ''}{formatCurrency(investment.change)} ({investment.changePercent}%)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {investments.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No investments tracked yet</p>
              <Button>Add Investment</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}