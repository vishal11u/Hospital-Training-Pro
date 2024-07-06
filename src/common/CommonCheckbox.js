import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function CommonCheckbox({ checked, onChange, label, labelPlacement = 'end', ...props }) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                    // inputProps={{ 'aria-label': label }}
                    {...props}
                />
            }
            label={label}
            labelPlacement={labelPlacement}
        />
    );
}

export default CommonCheckbox;
