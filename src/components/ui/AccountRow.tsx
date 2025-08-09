import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Account } from '@/types/database'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AccountRowProps {
  account: Account
  onEdit?: (account: Account) => void
  onDelete?: (account: Account) => void
  onViewTransactions?: (account: Account) => void
}

export function AccountRow({ account, onEdit, onDelete, onViewTransactions }: AccountRowProps) {
  const accountIcons = {
    checking: '💳',
    savings: '🏦',
    credit: '💳',
    investment: '📈',
    other: '💰',
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{accountIcons[account.type]}</div>
        <div>
          <p className="font-medium">{account.name}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {account.type}
            </Badge>
            <span className="text-sm text-muted-foreground">{account.currency}</span>
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
            <DropdownMenuItem onClick={() => onViewTransactions?.(account)}>
              View Transactions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(account)}>
              Edit Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(account)} className="text-red-600">
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}