import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, TrendingUp, Bitcoin, Home, Briefcase, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { useInvestments } from '@/hooks/useInvestments'

interface AddInvestmentModalProps {
  userId: string
}

export function AddInvestmentModal({ userId }: AddInvestmentModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as 'stocks' | 'crypto' | 'real-estate' | 'mutual-fund' | 'bonds' | 'other',
    current_value: '',
    invested_amount: '',
  })

  const { createInvestment } = useInvestments(userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createInvestment.mutateAsync({
        name: formData.name,
        type: formData.type,
        current_value: parseFloat(formData.current_value),
        invested_amount: parseFloat(formData.invested_amount),
      })
      
      toast.success('Investment added successfully')
      setOpen(false)
      setFormData({
        name: '',
        type: 'stocks',
        current_value: '',
        invested_amount: '',
      })
    } catch (error) {
      toast.error('Failed to add investment')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Investment Name</Label>
            <Input
              placeholder="e.g., Tech Stock Portfolio, Bitcoin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Investment Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stocks">Stocks</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                <SelectItem value="bonds">Bonds</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Invested Amount</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.invested_amount}
              onChange={(e) => setFormData({ ...formData, invested_amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Current Value</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.current_value}
              onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Investment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}