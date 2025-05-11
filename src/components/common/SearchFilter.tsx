
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
}

interface SearchFilterProps {
  placeholder?: string;
  filters?: FilterConfig[];
  onSearch?: (searchTerm: string, activeFilters: Record<string, string[]>) => void;
  className?: string;
  type?: "search";
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  placeholder = 'Buscar...',
  filters = [],
  onSearch,
  className,
  type = "search"
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const updateFilter = (filterId: string, optionId: string, isChecked: boolean) => {
    setActiveFilters(prev => {
      const currentOptions = prev[filterId] || [];
      
      if (isChecked) {
        return {
          ...prev,
          [filterId]: [...currentOptions, optionId]
        };
      } else {
        return {
          ...prev,
          [filterId]: currentOptions.filter(id => id !== optionId)
        };
      }
    });
  };

  const handleSearch = () => {
    onSearch?.(searchTerm, activeFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex gap-2 mb-4 ${className}`}>
      <div className="relative flex-grow">
        <Input
          type={type}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full"
        />
      </div>
      
      {filters.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter size={16} />
              Filtros
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {filters.map(filter => (
              <div key={filter.id} className="p-2">
                <div className="font-medium text-sm mb-1">{filter.label}</div>
                {filter.options.map(option => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={Boolean(activeFilters[filter.id]?.includes(option.id))}
                    onCheckedChange={(checked) => updateFilter(filter.id, option.id, checked)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <Button 
        onClick={handleSearch} 
        className="bg-cross-blue hover:bg-cross-blue/90"
      >
        Buscar
      </Button>
    </div>
  );
};

export default SearchFilter;
