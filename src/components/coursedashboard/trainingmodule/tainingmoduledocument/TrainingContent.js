import React from 'react';

function TrainingContent({ content }) {
    if (!content) {
        return <p>No content selected</p>;
    }

    if (content?.type === 'video') {
        return (
            <div className="training-content p-3 overflow-hidden overflow-y-auto">
                <h2 className='text-[18px] font-semibold'>{content?.model}</h2>
                <p className='text-[14px] font-medium'>{content?.summary}</p>
                <div className="video-section mt-3">
                    <div className="video w-full rounded-md">
                        <iframe
                            width="100%"
                            className='rounded-md'
                            height="400"
                            src={content?.link}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            controlsList="nodownload nofullscreen noremoteplayback"
                            disablePictureInPicture
                        ></iframe>
                    </div>
                </div>
                <div className='mt-3'>
                    <button type='button' className='text-[#3832D4] text-[15px] py-2 px-5 bg-[#DAD9F5] rounded-md shadow font-semibold'>
                        Read Document
                    </button>
                    <p className='mt-3 text-[13px] font-medium text-[#666666]'>
                        {content?.dsc}
                    </p>
                </div>
            </div>
        );
    }

    if (content?.type === 'assessment') {
        return (
            <div className="assessment-content p-3 overflow-hidden overflow-y-auto">
                <h2 className='text-[18px] font-semibold'>{content?.model}</h2>
                <p className='text-[14px] font-medium'>{content?.details}</p>
                <div className='mt-3'>
                    <button type='button' className='text-[#3832D4] text-[15px] py-2 px-5 bg-[#DAD9F5] rounded-md shadow font-semibold'>
                        Start Assessment
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default TrainingContent;
