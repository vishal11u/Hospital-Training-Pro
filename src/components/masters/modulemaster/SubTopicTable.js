import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import WithoutPaginationTable from '../../../common/WithoutPaginationTable';

function Sub_Topic_Table({ topicsInModule, setTopicsInModule }) {
    const renderAction = (row, index) => {
        return (
            <div className='flex items-center space-x-2 ml-1'>
                <button type='button' className='text-red-500' onClick={() => handleDeleteModule(index)}>
                    <MdDeleteOutline size={20} />
                </button>
            </div>
        )
    }

    const handleDeleteModule = (index) => {
        topicsInModule.splice(index, 1);
        setTopicsInModule([...topicsInModule]);
    }

    const filterData = topicsInModule.map((list) => ({
        id: list.id,
        value: list.value,
        TopicName: list.label
    }))

    return (
        <div className={`${topicsInModule.length > 0 ? 'mt-2' : 'mt-4'}`}>
            {topicsInModule.length > 0 ? (
                <WithoutPaginationTable
                    dataResult={filterData}
                    editableColumns={['Action', 'topic']}
                    removeHeaders={["value", "id"]}
                    renderActions={renderAction}
                />
            ) : (
                <p className='text-center font-semibold text-[18px] w-full'>No Record Found...</p>
            )}
        </div>
    )
}

export default Sub_Topic_Table;