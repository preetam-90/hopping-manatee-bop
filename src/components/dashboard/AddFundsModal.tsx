import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAccounts } from '@/hooks/useAccounts'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Account } from '@/types/database'

interface AddFundsModalProps {
  userId: string
  account: Account
}

export function AddFundsModal({ userId, account }: AddFundsModalProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const { updateAccount } = useAccounts(userId)

  const handleSubmit = async (e: React.FormFormEvent) => {
    e.preventDefault()
    
    const amountToAdd = parseFloat(amount)
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      toast.error('Please enter a valid positive amount.')
      return
    }

    try {
      await updateAccount.mutateAsync({
        id: account.id,
        balance: account.balance + amountToAdd,
      })
      
      toast.success(`Successfully added ${amountToAdd.toFixed(2)} to ${account.name}`)
      setOpen(false)
      setAmount('')
    } catch (error) {
      toast.error('Failed to add funds.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Funds to {account.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount to Add</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Confirm Add Funds
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}