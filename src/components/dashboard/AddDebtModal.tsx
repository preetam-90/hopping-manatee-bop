import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface AddDebtModalProps {
  userId: string
}

export function AddDebtModal({ userId }: AddDebtModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit-card',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    monthlyPayment: '',
    nextPaymentDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Implement debt creation
      toast.success('Debt added successfully')
      setOpen(false)
      setFormData({
        name: '',
        type: 'credit-card',
        originalAmount: '',
        currentBalance: '',
        interestRate: '',
        monthlyPayment: '',
        nextPaymentDate: '',
      })
    } catch (error) {
      toast.error('Failed to add debt')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Debt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Debt Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Credit Card, Car Loan"
              required
            />
          </div>
          
          <div>
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="mortgage">Mortgage</SelectItem>
                <SelectItem value="auto-loan">Auto Loan</SelectItem>
                <SelectItem value="student-loan">Student Loan</SelectItem>
                <SelectItem value="personal-loan">Personal Loan</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Original Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.originalAmount}
              onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label>Current Balance</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.currentBalance}
              onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label>Interest Rate (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label>Monthly Payment</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.monthlyPayment}
              onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label>Next Payment Date</Label>
            <Input
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Debt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}