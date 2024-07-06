import Backdrop from '@mui/material/Backdrop';
import * as React from 'react';
import CircularProgress, {
  circularProgressClasses
} from '@mui/material/CircularProgress';

export default function CommonBackDrop({openBackdrop,setOpenBackdrop}) {


  return (
    <div>
      {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        // onClick={handleClose}
        className='flex justify-center'
      >
        <CircularProgress color="inherit" 
        sx={{
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
          marginX:'auto',
          position: "absolute",
          left: "50%",
        }} 
        thickness={6}
        size={90}
        />
      </Backdrop>
    </div>
  );
}
