import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void
}

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [category, setCategory] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const [amountMin, setAmountMin] = useState<string>('')
  const [amountMax, setAmountMax] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const handleApplyFilters = () => {
    onFilterChange({
      dateRange,
      category,
      type,
      amountMin: amountMin ? parseFloat(amountMin) : undefined,
      amountMax: amountMax ? parseFloat(amountMax) : undefined
    })
  }

  const handleClearFilters = () => {
    setDateRange({})
    setCategory('all')
    setType('all')
    setAmountMin('')
    setAmountMax('')
    onFilterChange({})
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="w-full md:w-auto"
      >
        <Filter className="w-4 h-4 mr-2" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="bills">Bills & Utilities</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Min Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amountMin}
                    onChange={(e) => setAmountMin(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Max Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amountMax}
                    onChange={(e) => setAmountMax(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}