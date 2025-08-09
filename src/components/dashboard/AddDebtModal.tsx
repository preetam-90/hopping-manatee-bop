import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, CreditCard, Home, Car, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { useDebts } from '@/hooks/useDebts'

interface AddDebtModalProps {
  userId: string
}

export function AddDebtModal({ userId }: AddDebtModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit-card' as 'credit-card' | 'mortgage' | 'auto-loan' | 'student-loan' | 'personal-loan' | 'other',
    original_amount: '',
    current_balance: '',
    interest_rate: '',
    monthly_payment: '',
    next_payment_date: '',
  })

  const { createDebt } = useDebts(userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createDebt.mutateAsync({
        name: formData.name,
        type: formData.type,
        original_amount: parseFloat(formData.original_amount),
        current_balance: parseFloat(formData.current_balance),
        interest_rate: parseFloat(formData.interest_rate),
        monthly_payment: parseFloat(formData.monthly_payment),
        next_payment_date: formData.next_payment_date || null,
      })
      
      toast.success('Debt added successfully')
      setOpen(false)
      setFormData({
        name: '',
        type: 'credit-card',
        original_amount: '',
        current_balance: '',
        interest_rate: '',
        monthly_payment: '',
        next_payment_date: '',
      })
    } catch (error) {
      toast.error('Failed to add debt')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Debt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Debt Name</Label>
            <Input
              placeholder="e.g., Credit Card, Student Loan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Debt Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
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
              placeholder="0.00"
              value={formData.original_amount}
              onChange={(e) => setFormData({ ...formData, original_amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Current Balance</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.current_balance}
              onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Interest Rate (%)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.interest_rate}
              onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Monthly Payment</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.monthly_payment}
              onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Next Payment Date (Optional)</Label>
            <Input
              type="date"
              value={formData.next_payment_date}
              onChange={(e) => setFormData({ ...formData, next_payment_date: e.target.value })}
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