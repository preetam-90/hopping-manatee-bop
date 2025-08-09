import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Investment {
  id: string
  name: string
  symbol: string
  type: string
  quantity: number
  currentPrice: number
  purchasePrice: number
  totalValue: number
}

export default function Investments() {
  const { user } = useAuth()
  const [investments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'Stock',
      quantity: 10,
      currentPrice: 175.50,
      purchasePrice: 150.00,
      totalValue: 1755.00
    },
    {
      id: '2',
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'Crypto',
      quantity: 0.5,
      currentPrice: 45000,
      purchasePrice: 40000,
      totalValue: 22500
    }
  ])

  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0)
  const totalGain = investments.reduce((sum, inv) => 
    sum + ((inv.currentPrice - inv.purchasePrice) * inv.quantity), 0
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Investments</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              totalGain >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Return</CardTitle>
          </CardContent>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              totalGain >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {totalValue > 0 ? ((totalGain / (totalValue - totalGain)) * 100).toFixed(2) : '0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => {
              const gain = (investment.currentPrice - investment.purchasePrice) * investment.quantity
              const gainPercent = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100
              
              return (
                <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{investment.name}</p>
                    <p className="text-sm text-muted-foreground">{investment.symbol} • {investment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(investment.totalValue)}</p>
                    <p className={cn(
                      "text-sm",
                      gain >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {gain >= 0 ? '+' : ''}{formatCurrency(gain)} ({gainPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}