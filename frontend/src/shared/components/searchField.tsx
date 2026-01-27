import React, { useEffect, useRef, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFieldProps {
  onSearchChange: (searchTerm: string) => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100); // 100ms é geralmente suficiente

    return () => clearTimeout(timer);
  }, []);

  return (
    <TextField
      variant="outlined"
      placeholder="Pesquisar..."
      value={searchTerm} 
      onChange={handleInputChange} 
      fullWidth
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};