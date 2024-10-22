// FilterChips.js
import React from 'react';
import { Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format } from 'date-fns';

const FilterChips = ({ selectedFilter, setSelectedFilter, selectedMonth, setSelectedMonth }) => {
    const generateMonthOptions = () => {
        const options = [];
        const currentMonth = new Date();
        for (let i = 0; i < 12; i++) {
            const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
            options.push(month);
        }
        return options;
    };

    return (
        <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
                {['all', 'today', 'week', 'month', 'year'].map((filter) => (
                    <Chip
                        key={filter}
                        label={filter === 'all' || filter === 'today'
                            ? filter.charAt(0).toUpperCase() + filter.slice(1)
                            : `This ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                        color={selectedFilter === filter ? 'primary' : 'default'}
                        onClick={() => setSelectedFilter(filter)}
                    />
                ))}

                <FormControl variant="outlined" style={{ minWidth: 150 }} size='small'>
                    <InputLabel>Past Months</InputLabel>
                    <Select
                        value={selectedMonth ? format(selectedMonth, 'MMM-yyyy') : ''}
                        onChange={(e) => {
                            const selectedDate = generateMonthOptions().find(
                                (month) => format(month, 'MMM-yyyy') === e.target.value
                            );
                            setSelectedFilter('customMonth');
                            setSelectedMonth(selectedDate);
                        }}
                        label="Past Months"
                    >
                        {generateMonthOptions().map((month, index) => (
                            <MenuItem key={index} value={format(month, 'MMM-yyyy')}>
                                {format(month, 'MMM-yyyy')}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </>
    );
};

export default FilterChips;
