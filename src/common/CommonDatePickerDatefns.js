import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

export default function CommonDatePickerDayjs({
  name,
  control,
  defaultValue,
  label,
  onChange,
  onError,
  error,
  disabled,
  format,
  disablePast,
  disableFuture,
}) {
  return (
    <div className='w-full bg-white'>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange: controllerOnChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={value ? dayjs(value) : null}
              onChange={(newValue) => {
                const formattedValue = newValue ? dayjs(newValue).format('YYYY-MM-DD') : '';
                controllerOnChange(formattedValue);
                if (onChange) {
                  onChange(formattedValue);
                }
              }}
              label={label}
              disabled={disabled}
              disablePast={disablePast}
              disableFuture={disableFuture}
              inputFormat={format}
              sx={{
                '& .MuiOutlinedInput-input': {
                  padding: '7px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '15px',
                  fontWeight: 400,
                  color: "gray"
                },
              }}
              slotProps={{ textField: { size: 'small' } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!error}
                  helperText={error ? error.message : null}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: "14px",
                      position: "absolute",
                      top: "-2px",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        )}
      />
    </div>
  );
}