import React from 'react';

function TrainingVideos({ video }) {
    const getVideoId = (url) => {
        if (!url) return null;
        const videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            return videoId.substring(0, ampersandPosition);
        }
        return videoId;
    };

    const embedUrl = video ? `https://www.youtube.com/embed/${getVideoId(video?.id?.link)}` : '';

    return (
        <div className="training-videos p-3 overflow-hidden overflow-y-auto">
            <div className="video-section mt-3">
                <div className="video w-full rounded-md">
                    {embedUrl && (
                        <iframe
                            title="Training Video"
                            width="100%"
                            height="400"
                            src={embedUrl}
                            frameBorder="0"
                            allow="encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            controlsList="nodownload nofullscreen noremoteplayback noautoplay noaccelerometer"
                            disablePictureInPicture
                        ></iframe>
                    )}
                </div>
            </div>
            <div className='mt-3'>
                <button type='button' className='text-[#3832D4] text-[15px] py-2 px-5 bg-[#e9dffa] font-medium rounded-[5px] transition-all hover:bg-gray-400 hover:text-white'>
                    Read Document
                </button>
            </div>
        </div>
    );
}

export default TrainingVideos;
