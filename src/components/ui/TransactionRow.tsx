import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TransactionRowProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex-1">
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
      <div className="text-right">
        <p className={cn(
          'font-semibold',
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        )}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
        <Badge variant="outline" className="text-xs">
          {(transaction as any).category?.name || 'Uncategorized'}
        </Badge>
      </div>
    </div>
  )
}