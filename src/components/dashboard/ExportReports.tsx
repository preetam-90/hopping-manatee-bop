import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction, Account, Category } from '@/types/database'

interface ExportReportsProps {
  transactions: Transaction[]
  accounts: Account[]
  categories: Category[]
}

export function ExportReports({ transactions, accounts, categories }: ExportReportsProps) {
  const [reportType, setReportType] = useState<'summary' | 'transactions' | 'budget'>('summary')
  const [formatType, setFormatType] = useState<'pdf' | 'csv'>('pdf')
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month')

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return ''
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(fieldName => JSON.stringify(row[fieldName] ?? ''))
          .join(',')
      )
    ]
    return csvRows.join('\r\n')
  }

  const getSummaryData = () => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return {
      'Total Accounts': accounts.length,
      'Total Transactions': transactions.length,
      'Total Income': formatCurrency(totalIncome),
      'Total Expenses': formatCurrency(totalExpenses),
      'Net Savings': formatCurrency(totalIncome - totalExpenses),
    }
  }

  const generateReport = () => {
    const fileName = `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}`
    toast.info(`Generating your ${reportType} report...`)

    try {
      if (formatType === 'csv') {
        generateCSV(fileName)
      } else {
        generatePDF(fileName)
      }
      toast.success('Report generated successfully!')
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast.error('Failed to generate report.')
    }
  }

  const generateCSV = (fileName: string) => {
    let data: any[] = []
    if (reportType === 'summary') {
      const summary = getSummaryData()
      data = Object.entries(summary).map(([key, value]) => ({ Metric: key, Value: value }))
    } else if (reportType === 'transactions') {
      data = transactions.map(t => ({
        Date: formatDate(t.date),
        Description: t.description,
        Amount: t.amount,
        Type: t.type,
        Category: (t as any).category?.name || 'N/A',
        Account: (t as any).account?.name || 'N/A',
      }))
    } else if (reportType === 'budget') {
      data = categories
        .filter(c => c.budget_limit && c.budget_limit > 0)
        .map(c => {
          const spent = transactions
            .filter(t => t.category_id === c.id && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
          return {
            Category: c.name,
            Budget: c.budget_limit,
            Spent: spent,
            Remaining: (c.budget_limit || 0) - spent,
          }
        })
    }
    const csvString = convertToCSV(data)
    downloadFile(csvString, `${fileName}.csv`, 'text/csv;charset=utf-8;')
  }

  const generatePDF = (fileName: string) => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(`Financial Report: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 28)

    if (reportType === 'summary') {
      autoTable(doc, {
        startY: 35,
        head: [['Metric', 'Value']],
        body: Object.entries(getSummaryData()),
      })
    } else if (reportType === 'transactions') {
      autoTable(doc, {
        startY: 35,
        head: [['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']],
        body: transactions.map(t => [
          formatDate(t.date),
          t.description,
          formatCurrency(t.amount, (t as any).account?.currency),
          t.type,
          (t as any).category?.name || 'N/A',
          (t as any).account?.name || 'N/A',
        ]),
      })
    } else if (reportType === 'budget') {
      const budgetData = categories
        .filter(c => c.budget_limit && c.budget_limit > 0)
        .map(c => {
          const spent = transactions
            .filter(t => t.category_id === c.id && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
          return [
            c.name,
            formatCurrency(c.budget_limit || 0),
            formatCurrency(spent),
            formatCurrency((c.budget_limit || 0) - spent),
          ]
        })
      autoTable(doc, {
        startY: 35,
        head: [['Category', 'Budget', 'Spent', 'Remaining']],
        body: budgetData,
      })
    }

    doc.save(`${fileName}.pdf`)
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
            <Select value={reportType} onValueChange={(v) => setReportType(v as any)}>
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
            <Select value={formatType} onValueChange={(v) => setFormatType(v as any)}>
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
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
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