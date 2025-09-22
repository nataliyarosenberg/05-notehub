import { useState } from 'react';
import css from './SearchBox.module.css';
import { useDebouncedCallback } from 'use-debounce';


interface SearchBoxProps {
    onSubmit: (searchValue: string) => void;

}

export default function SearchBox({ onSubmit }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState('');
   
const debouncedSubmit = useDebouncedCallback((value: string) => {
    onSubmit(value);
}, 300);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      debouncedSubmit(value);
    };

    return (
      <input
        className={css.input}
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search notes"
      />
    );
}