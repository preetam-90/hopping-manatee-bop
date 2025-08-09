import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useAccounts } from '@/hooks/useAccounts'
import { CreditCard, PiggyBank, Landmark, Wallet, MoreVertical } from 'lucide-react'
import { AddAccountModal } from './AddAccountModal'
import { AddFundsModal } from './AddFundsModal' // Import the new modal
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface AccountsListProps {
  userId: string
}

const accountIcons = {
  checking: <Landmark className="w-5 h-5" />,
  savings: <PiggyBank className="w-5 h-5" />,
  credit: <CreditCard className="w-5 h-5" />,
  investment: <Wallet className="w-5 h-5" />,
  other: <Wallet className="w-5 h-5" />,
}

export function AccountsList({ userId }: AccountsListProps) {
  const { accounts, isLoading, deleteAccount } = useAccounts(userId)

  const handleDeleteAccount = async (accountId: string, accountName: string) => {
    if (window.confirm(`Are you sure you want to delete "${accountName}"? This will also delete all associated transactions.`)) {
      try {
        await deleteAccount.mutateAsync(accountId)
        toast.success('Account deleted successfully')
      } catch (error) {
        toast.error('Failed to delete account')
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Accounts</CardTitle>
        <AddAccountModal userId={userId} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts?.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  {accountIcons[account.type]}
                </div>
                <div>
                  <p className="font-medium">{account.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {account.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {account.currency}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(account.balance, account.currency)}</p>
                  <p className="text-sm text-muted-foreground">Balance</p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <AddFundsModal userId={userId} account={account} />
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteAccount(account.id, account.name)}
                    >
                      Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          
          {accounts?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No accounts yet</p>
              <AddAccountModal userId={userId} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}