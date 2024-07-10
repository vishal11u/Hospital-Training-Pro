import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RunTimeTopicVideo from './runtimetopicvideo/RunTimeTopicVideo';
import RunTimeTopicAsseement from './runtimetopicassesment/RunTimeTopicAsseement';

function RunTimeTopicCourses() {
    const [videoAccordionExpanded, setVideoAccordionExpanded] = useState(false);
    const [assessmentAccordionExpanded, setAssessmentAccordionExpanded] = useState(false);

    const handleVideoAccordionChange = (event, isExpanded) => {
        setVideoAccordionExpanded(isExpanded);
    };

    const handleAssessmentAccordionChange = (event, isExpanded) => {
        setAssessmentAccordionExpanded(isExpanded);
    };

    return (
        <div>
            <h1 className='mt-0 text-[20px] font-semibold text-center'>RunTime Topic Courses</h1>
            {/* ----------------- topic section ---------------- */}
            <div className='mt-7'>
                <div className=''>
                    <h1 className='text-[16px] -mb-2 font-semibold'>Topic Name :</h1>
                </div>
                {/* ------------- Video Accordion -------------- */}
                <Accordion
                    expanded={videoAccordionExpanded}
                    onChange={handleVideoAccordionChange}
                    sx={{
                        mt: videoAccordionExpanded ? 2 : 2, borderRadius: 2,
                        borderTop: "none"
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <p className='font-medium text-[16px]'>
                            Topic Video :
                        </p>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            mt: videoAccordionExpanded ? -2.5 : -2.5,
                            overflowY: 'auto'
                        }}
                    >
                        {videoAccordionExpanded && (
                            <RunTimeTopicVideo />
                        )}
                    </AccordionDetails>
                </Accordion>
                {/* ------------- Pre-Assessment Accordion -------------- */}
                <Accordion
                    expanded={assessmentAccordionExpanded}
                    onChange={handleAssessmentAccordionChange}
                    sx={{ mt: assessmentAccordionExpanded ? 2 : 2, borderRadius: 2 }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <p className='font-medium text-[16px]'>
                            Topic Assessment :
                        </p>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            mt: assessmentAccordionExpanded ? -3 : -3,
                            overflowY: 'auto'
                        }}
                    >
                        {assessmentAccordionExpanded && (
                            <RunTimeTopicAsseement />
                        )}
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    )
}

export default RunTimeTopicCourses;