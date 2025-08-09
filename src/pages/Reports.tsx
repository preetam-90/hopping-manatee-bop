import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import { ExportReports } from '@/components/dashboard/ExportReports'

export default function Reports() {
  const { user } = useAuth()
  const { accounts } = useAccounts(user?.id || '')
  const { transactions } = useTransactions(user?.id || '')
  const { categories } = useCategories(user?.id || '')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Reports & Export</h2>
      </div>

      <ExportReports 
        transactions={transactions || []} 
        accounts={accounts || []}
        categories={categories || []}
      />
    </div>
  )
}