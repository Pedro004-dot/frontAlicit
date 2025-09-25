'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export default function TagInput({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  label,
  required = false 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  
  const tags = value ? value.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      onChange(newTags.join(', '));
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags.join(', '));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <div className="w-full min-h-[3rem] px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#FF5000] focus-within:border-[#FF5000] transition-all duration-200 bg-white">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FF5000] text-white"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#E04000] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="border-0 outline-none flex-1 w-full bg-transparent text-gray-900 placeholder-gray-500"
        />
      </div>
      
      <p className="text-sm text-gray-600 mt-2">
        Digite e pressione Enter ou vírgula para adicionar. Backspace para remover a última tag.
      </p>
    </div>
  );
}