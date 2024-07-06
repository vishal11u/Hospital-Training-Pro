import React from 'react';
import { lineSpinner } from 'ldrs'

lineSpinner.register();

function CommonLoader() {
    return (
        <div className='flex items-center justify-center mt-10 h-full'>
            <l-line-spinner
                size="40"
                stroke="3"
                speed="1"
                color="black"
            ></l-line-spinner>
        </div>
    )
}

export default CommonLoader;