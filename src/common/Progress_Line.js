import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                    variant="determinate"
                    {...props}
                    sx={{
                        borderRadius: 12,
                        height: 6,
                        backgroundColor: props.bgColor || 'grey.200',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: props.barColor || 'primary.main',
                        },
                    }}
                />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

function Progress_Line({ initialProgress = 10, increment = 10, interval = 800, resetAt = 100, bgColor, barColor }) {
    const [progress, setProgress] = React.useState(initialProgress);

    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= resetAt ? initialProgress : prevProgress + increment));
    //     }, interval);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, [initialProgress, increment, interval, resetAt]);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} barColor={barColor} bgColor={bgColor} />
        </Box>
    );
}

Progress_Line.propTypes = {
    initialProgress: PropTypes.number,
    increment: PropTypes.number,
    interval: PropTypes.number,
    resetAt: PropTypes.number,
    barColor: PropTypes.string,
    bgColor: PropTypes.string,
};

export default Progress_Line;