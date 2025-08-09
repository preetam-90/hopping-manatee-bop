import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'

interface SpendingChartProps {
  transactions: any[]
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Calculate date range
  const getDateRange = () => {
    const end = new Date()
    const start = new Date()
    
    switch (timeRange) {
      case '7d':
        start.setDate(end.getDate() - 7)
        break
      case '30d':
        start.setDate(end.getDate() - 30)
        break
      case '90d':
        start.setDate(end.getDate() - 90)
        break
    }
    
    return { start, end }
  }

  const { start } = getDateRange()
  
  // Filter transactions by date range
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= start
  })

  // Group by category for pie chart
  const categoryData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category?.name || 'Uncategorized'
      acc[category] = (acc[category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  // Group by date for line chart
  const dailyData = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 }
    }
    if (t.type === 'income') {
      acc[date].income += t.amount
    } else {
      acc[date].expense += t.amount
    }
    return acc
  }, {} as Record<string, { date: string; income: number; expense: number }>)

  const lineData = Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="flex justify-end">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="categories">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}