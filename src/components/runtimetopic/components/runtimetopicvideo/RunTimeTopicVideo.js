import React from 'react';

function RunTimeTopicVideo() {
    const videos = [
        {
            id: 'segment1',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            startTime: 0,
            endTime: 10,
        }
    ];

    return (
        <div className="training-videos overflow-hidden overflow-y-auto">
            <div className="video-section">
                {videos.length > 0 ? (
                    <div className="video">
                        {videos.map((video) => (
                            <div key={video.id} className="relative">
                                <video
                                    className="rounded-lg mx-auto"
                                    width="100%"
                                    height="auto"
                                    controls
                                    controlsList="nodownload"
                                    disablePictureInPicture
                                >
                                    <source src={video.url} type="video/mp4" />
                                </video>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className="text-center my-2 font-medium">
                        No videos found
                        <span className="animate-pulse">...</span>
                    </h1>
                )}
            </div>
        </div>
    );
}

export default RunTimeTopicVideo;