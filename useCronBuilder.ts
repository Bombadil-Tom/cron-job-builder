import { useState } from 'react';
import {SelectsState} from "./CronJobBuilder";

interface UseCronBuilderReturn {
    cronString: string;
    selects: SelectsState;
    handleClear: () => void;
    handleChange: (fieldName: keyof SelectsState, value: string) => void;
}

export function useCronBuilder(initialState: SelectsState): UseCronBuilderReturn {
    const [cronString, setCronString] = useState<string>('* * * * *');
    const [selects, setSelects] = useState<SelectsState>(initialState);

    const handleClear = (): void => {
        setSelects({
            firstSelect: 'Year',
            secondSelect: '*',
            thirdSelect: '*',
            fourthSelect: '*',
            fifthSelect: '*',
            sixthSelect: '*',
        });
        setCronString('* * * * *');
    };

    const handleChange = (fieldName: keyof SelectsState, value: string): void => {
        const newSelects = { ...selects, [fieldName]: value };
        setSelects(newSelects);

        let minute = '*';
        let hour = '*';
        let dayOfMonth = '*';
        let month = '*';
        let dayOfWeek = '*';

        switch (newSelects.firstSelect) {
            case 'Minute':
                minute = newSelects.sixthSelect;
                break;
            case 'Hour':
                minute = newSelects.sixthSelect;
                hour = newSelects.fifthSelect;
                break;
            case 'Day':
            case 'Week':
                minute = newSelects.sixthSelect;
                hour = newSelects.fifthSelect;
                if (newSelects.firstSelect === 'Week') {
                    dayOfWeek = newSelects.fourthSelect;
                }
                break;
            case 'Month':
                minute = newSelects.sixthSelect;
                hour = newSelects.fifthSelect;
                dayOfMonth = newSelects.thirdSelect;
                break;
            case 'Year':
                minute = newSelects.sixthSelect;
                hour = newSelects.fifthSelect;
                dayOfMonth = newSelects.thirdSelect;
                month = newSelects.secondSelect;
                dayOfWeek = newSelects.fourthSelect;
                break;
        }

        const newCronString = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
        setCronString(newCronString);
    };

    return {
        cronString,
        selects,
        handleClear,
        handleChange
    };
}
