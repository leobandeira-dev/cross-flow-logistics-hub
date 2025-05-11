
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { FilterOption, getDateRanges } from './StandardFilterConfig';

interface SearchFilterProps {
  placeholder?: string;
  filters?: { 
    name: string;
    options: FilterOption[];
  }[];
  onSearch?: (value: string) => void;
  onFilterChange?: (filter: string, value: string) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  placeholder = "Buscar...", 
  filters = [],
  onSearch,
  onFilterChange,
  onDateRangeChange
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dateFilterType, setDateFilterType] = useState<string>('custom');
  
  const form = useForm({
    defaultValues: {
      search: '',
      ...filters.reduce((acc, filter) => {
        acc[filter.name.toLowerCase().replace(/\s/g, '_')] = 'all';
        return acc;
      }, {} as Record<string, string>)
    }
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    // Update active filters
    setActiveFilters(prev => ({ ...prev, [filterName]: value }));
    
    // Handle date range filters
    if (filterName === 'Período') {
      setDateFilterType(value);
      
      const dateRanges = getDateRanges();
      let newDateRange: DateRange | undefined;
      
      switch (value) {
        case 'last7Days':
          newDateRange = dateRanges.last7Days;
          break;
        case 'last30Days':
          newDateRange = dateRanges.last30Days;
          break;
        case 'currentMonth':
          newDateRange = dateRanges.currentMonth;
          break;
        case 'custom':
          // Keep current custom date range if it exists
          newDateRange = dateRange;
          break;
        default:
          newDateRange = undefined;
      }
      
      setDateRange(newDateRange);
      if (onDateRangeChange) {
        onDateRangeChange(newDateRange);
      }
    }
    
    if (onFilterChange) {
      onFilterChange(filterName, value);
    }
  };

  const handleCustomDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    if (dateFilterType === 'custom' && onDateRangeChange) {
      onDateRangeChange(newDateRange);
    }
  };

  const clearFilter = (filterName: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      delete updated[filterName];
      return updated;
    });
    
    if (filterName === 'Período') {
      setDateRange(undefined);
      setDateFilterType('custom');
      if (onDateRangeChange) {
        onDateRangeChange(undefined);
      }
    }
    
    if (onFilterChange) {
      onFilterChange(filterName, 'all');
    }
  };

  // Group filters into primary and secondary
  const primaryFilters = filters.slice(0, 3); // First 3 filters are primary
  const secondaryFilters = filters.slice(3);  // Rest are secondary

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text" // Changed from "search" to "text" to fix the type error
              placeholder={placeholder}
              className="pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Date Range Filter */}
          {filters.some(filter => filter.name === 'Período') && (
            <div className="w-full lg:w-64">
              <Select value={dateFilterType} onValueChange={(value) => handleFilterChange('Período', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {filters.find(filter => filter.name === 'Período')?.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Date Range Picker */}
          {dateFilterType === 'custom' && (
            <div className="w-full lg:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "justify-start text-left w-full lg:w-[300px]",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleCustomDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Primary Filters */}
          {primaryFilters.filter(filter => filter.name !== 'Período').map((filter) => (
            <div key={filter.name} className="w-full lg:w-64">
              <Select 
                onValueChange={(value) => handleFilterChange(filter.name, value)}
                value={activeFilters[filter.name] || 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${filter.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button onClick={handleSearch} className="bg-cross-blue hover:bg-cross-blueDark">
            <Search size={18} className="mr-2" /> Buscar
          </Button>
        </div>

        {/* Filter Tags */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterName, value]) => {
              if (value === 'all') return null;
              
              // Find the label for the selected value
              const filterConfig = filters.find(f => f.name === filterName);
              const optionLabel = filterConfig?.options.find(o => o.value === value)?.label || value;
              
              // Don't show 'custom' for date filter
              if (filterName === 'Período' && value === 'custom') return null;

              return (
                <div 
                  key={`${filterName}-${value}`} 
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span className="font-medium mr-1">{filterName}:</span>
                  <span>{optionLabel}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0 ml-1 hover:bg-gray-200"
                    onClick={() => clearFilter(filterName)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Advanced Filters Dropdown */}
        {secondaryFilters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter size={18} className="mr-2" /> Filtros Avançados
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Form {...form}>
                <form className="space-y-4">
                  {secondaryFilters.map((filter) => (
                    <FormField
                      key={filter.name}
                      control={form.control}
                      name={filter.name.toLowerCase().replace(/\s/g, '_')}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{filter.name}</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleFilterChange(filter.name, value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={`Selecione ${filter.name.toLowerCase()}`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  ))}
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
