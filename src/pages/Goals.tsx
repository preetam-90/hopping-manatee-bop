import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
}

export default function Goals() {
  const { user } = useAuth()
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      targetDate: '2024-12-31',
      category: 'Savings'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 1200,
      targetDate: '2024-08-15',
      category: 'Travel'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Financial Goals</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  {goal.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <Progress value={progress} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% complete</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}