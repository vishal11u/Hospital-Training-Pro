import React from 'react';

const useBase64 = ({ base64String, fileName }) => {
    const decodeBase64 = (base64String) => {
        const binaryString = window.atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const getMimeType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'txt':
                return 'text/plain';
            case 'doc':
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'xls':
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'ppt':
            case 'pptx':
                return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            default:
                return 'application/octet-stream';
        }
    };

    const renderFile = () => {
        try {
            const decodedData = decodeBase64(base64String);
            const fileType = getMimeType(fileName);
            const blob = new Blob([decodedData], { type: fileType });
            const url = URL.createObjectURL(blob);

            switch (fileType) {
                case 'application/pdf':
                    return <embed src={url} type="application/pdf" width="100%" height="600px" />;
                case 'text/plain':
                    return <pre>{decodedData}</pre>;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                case 'application/msword':
                    return (
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
                            title="Word Document"
                            width="100%"
                            height="600px"
                        ></iframe>
                    );
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    return (
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
                            title="Excel Spreadsheet"
                            width="100%"
                            height="600px"
                        ></iframe>
                    );
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                    return (
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
                            title="PowerPoint Presentation"
                            width="100%"
                            height="600px"
                        ></iframe>
                    );
                default:
                    return <p>Unsupported file type: {fileType}</p>;
            }
        } catch (error) {
            console.error('Error displaying file:', error);
            return <p>Error displaying file. Please check the provided Base64 string and file name.</p>;
        }
    };
    return <div>{renderFile()}</div>;
};

export default useBase64;