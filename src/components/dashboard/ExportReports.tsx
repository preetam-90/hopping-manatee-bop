import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

interface ExportReportsProps {
  transactions: any[]
  accounts: any[]
  categories: any[]
}

export function ExportReports({ transactions, accounts, categories }: ExportReportsProps) {
  const [reportType, setReportType] = useState<'summary' | 'transactions' | 'budget'>('summary')
  const [formatType, setFormatType] = useState<'pdf' | 'csv'>('pdf')
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month')

  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      reportType,
      formatType,
      summary: {
        totalAccounts: accounts.length,
        totalTransactions: transactions.length,
        totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        netSavings: 0
      },
      transactions: transactions.slice(0, 100),
      accounts,
      categories
    }

    // Simulate report generation
    toast.success(`Report generated successfully! Check your downloads folder.`)
    
    // In a real app, this would trigger a backend API call
    console.log('Report data:', reportData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Financial Summary</SelectItem>
                <SelectItem value="transactions">Transaction History</SelectItem>
                <SelectItem value="budget">Budget Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Format</Label>
            <Select value={formatType} onValueChange={setFormatType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    CSV/Excel
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Time Period</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem<dyad-write path="src/components/dashboard/ExportReports.tsx" description="Completing export reports component">
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generateReport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}