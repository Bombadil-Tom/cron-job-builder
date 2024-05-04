import React from 'react';
import {useCronBuilder} from "./useCronBuilder";

interface SelectOption {
    value: string;
    label: string;
}

export interface SelectsState {
    firstSelect: string;
    secondSelect: string;
    thirdSelect: string;
    fourthSelect: string;
    fifthSelect: string;
    sixthSelect: string;
}

interface CronJobBuilderProps {
    verticalAlign?: 'top' | 'middle' | 'bottom';
    horizontalAlign?: 'left' | 'center' | 'right';
    labelAlign?: 'left' | 'center' | 'right';
    buttonAlign?: 'left' | 'center' | 'right';
    padding?: string;
    margin?: string;
    flexDirection?: 'row' | 'column';
    SelectComponent?: React.ComponentType<{
        name: keyof SelectsState;
        label: string;
        options: SelectOption[];
        value: string;
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    }>;
    ButtonComponent?: React.ComponentType<{
        onClick: () => void;
    }>;
}

const CronJobBuilder: React.FC<CronJobBuilderProps> = ({
                                                           verticalAlign = 'middle',
                                                           horizontalAlign = 'center',
                                                           labelAlign = 'center',
                                                           buttonAlign = 'center',
                                                           padding = '0',
                                                           margin = '0',
                                                           flexDirection = 'column',
                                                           SelectComponent,
                                                           ButtonComponent
                                                       }) => {
    const {cronString, selects, handleClear, handleChange} = useCronBuilder({
        firstSelect: 'Year',
        secondSelect: '*',
        thirdSelect: '*',
        fourthSelect: '*',
        fifthSelect: '*',
        sixthSelect: '*',
    });

    const renderSelectField = (name: keyof SelectsState, label: string, options: SelectOption[]) => {
        if (SelectComponent) {
            return (
                <SelectComponent
                    name={name}
                    label={label}
                    options={options}
                    value={selects[name]}
                    onChange={(e) => handleChange(name, e.target.value)}
                />
            );
        } else {
            return (
                <div className="select-field">
                    <label>{label}</label>
                    <select name={name} value={selects[name]} onChange={(e) => handleChange(name, e.target.value)}>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            );
        }
    }

    const renderButton = () => {
        return ButtonComponent ? (
            <ButtonComponent onClick={handleClear} />
        ) : (
            <button onClick={handleClear}>Clear</button>
        );
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: flexDirection,
            alignItems: verticalAlign,
            justifyContent: horizontalAlign,
            padding: padding,
            margin: margin,
        }}>
            {renderSelectField('firstSelect', 'Every', [
                {value: 'Year', label: 'Year'},
                {value: 'Month', label: 'Month'},
                {value: 'Week', label: 'Week'},
                {value: 'Day', label: 'Day'},
                {value: 'Hour', label: 'Hour'},
                {value: 'Minute', label: 'Minute'},
            ])}
            {selects.firstSelect === 'Year' && renderSelectField('secondSelect', 'in', [
                {value: '*', label: 'Every month'},
                ...Array.from({length: 12}, (_, i) => ({
                    value: (i + 1).toString(),
                    label: new Date(0, i + 1, 0).toLocaleString('en-US', {month: 'long'}),
                })),
            ])}
            {['Year', 'Month'].includes(selects.firstSelect) && renderSelectField('thirdSelect', 'on', [
                {value: '*', label: 'Every day of the month'},
                ...Array.from({length: 31}, (_, i) => ({value: (i + 1).toString(), label: (i + 1).toString()})),
            ])}
            {['Year', 'Week', 'Month'].includes(selects.firstSelect) && renderSelectField('fourthSelect', selects.firstSelect === 'Week' ? 'on' : 'and', [
                {value: '*', label: 'Every day of the week'},
                ...['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => ({
                    value: index.toString(),
                    label: day
                })),
            ])}
            {['Year', 'Month', 'Week', 'Day'].includes(selects.firstSelect) && renderSelectField('fifthSelect', 'at (hour)', [
                {value: '*', label: 'Every hour'},
                ...Array.from({length: 24}, (_, i) => ({value: i.toString(), label: i.toString()})),
            ])}
            {['Year', 'Month', 'Week', 'Day', 'Hour'].includes(selects.firstSelect) && renderSelectField('sixthSelect', ': (minute)', [
                {value: '*', label: 'Every minute'},
                ...Array.from({length: 60}, (_, i) => ({value: i.toString(), label: i.toString()})),
            ])}
            <div className="pt-1 pb-1 d-flex justify-content-space-between flex-center">
                <div>
                    <span>Cron String:</span> {cronString}
                </div>
                <div style={{ display: 'flex', justifyContent: buttonAlign }}>
                    {renderButton()}
                </div>
            </div>
        </div>
    );
};

export default CronJobBuilder;
