import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Plus, Target, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  createdAt: string
}

interface GoalTrackerProps {
  userId: string
}

export function GoalTracker({ userId }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      targetDate: '2024-12-31',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 1200,
      targetDate: '2024-08-15',
      createdAt: '2024-02-01'
    }
  ])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    currentAmount: ''
  })

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const calculateDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setGoals([...goals, newGoal])
    setFormData({ name: '', targetAmount: '', targetDate: '', currentAmount: '' })
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Savings Goals</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <Label>Goal Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Emergency Fund, Vacation"
                  required
                />
              </div>
              <div>
                <Label>Target Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label>Current Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
            const daysRemaining = calculateDaysRemaining(goal.targetDate)
            const monthlySavingsNeeded = daysRemaining > 0 
              ? (goal.targetAmount - goal.currentAmount) / (daysRemaining / 30)
              : 0

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{progress.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">{daysRemaining} days left</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                {monthlySavingsNeeded > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Save {formatCurrency(monthlySavingsNeeded)} per month to reach your goal
                  </p>
                )}
              </div>
            )
          })}
          
          {goals.length === 0 && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No savings goals yet</p>
              <Button onClick={() => setOpen(true)}>
                Create Your First Goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}