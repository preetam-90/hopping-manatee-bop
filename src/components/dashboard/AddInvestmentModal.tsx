import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface AddInvestmentModalProps {
  userId: string
}

export function AddInvestmentModal({ userId }: AddInvestmentModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: 'stocks',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Implement investment creation
      toast.success('Investment added successfully')
      setOpen(false)
      setFormData({
        name: '',
        symbol: '',
        type: 'stocks',
        quantity: '',
        purchasePrice: '',
        currentPrice: '',
      })
    } catch (error) {
      toast.error('Failed to add investment')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Apple Inc."
              required
            />
          </div>
          
          <div>
            <Label>Symbol</Label>
            <Input
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="e.g., AAPL"
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
            <Label>Quantity</Label>
            <Input
              type="number"
              step="0.0001"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label>Purchase Price</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label>Current Price</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
              placeholder="0.00"
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