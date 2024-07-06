import React, { useCallback, useState } from 'react';
import WithoutPaginationTable from '../../../common/WithoutPaginationTable';
import { MdDeleteOutline } from 'react-icons/md';
import CommonCheckbox from '../../../common/CommonCheckbox';

function Sub_Module_Table({ topicsInModule, setTopicsInModule }) {

    const handleDeleteModule = (index) => {
        topicsInModule.splice(index, 1);
        setTopicsInModule([...topicsInModule]);
    };

    const renderInput = useCallback((row, index, header) => {
        return (
            <div className='-my-2 font-medium'>
                {header === "PreAssesment" && (
                    <div className='pl-5'>
                        <CommonCheckbox checked={row.PreAssesment} />
                    </div>
                )}
                {header === "PostAssesment" && (
                    <div className='pl-5'>
                        <CommonCheckbox checked={row.PostAssesment} />
                    </div>
                )}
            </div>
        );
    }, []);

    const renderAction = (row, index) => {
        return (
            <div className='flex items-center space-x-2 ml-1'>
                <button type='button' className='text-red-500' onClick={() => handleDeleteModule(index)}>
                    <MdDeleteOutline size={20} />
                </button>
            </div>
        )
    }

    const filterData = topicsInModule.map((list) => ({
        id: list.id,
        value: list.value,
        ModuleName: list.label,
        PreAssesment: list.ispreass,
        PostAssesment: list.ispostass,
    }))

    return (
        <div className={`${topicsInModule.length > 0 ? 'mt-2' : 'mt-4'}`}>
            {topicsInModule.length > 0 ? (
                <WithoutPaginationTable
                    dataResult={filterData}
                    editableColumns={["PreAssesment", "PostAssesment"]}
                    removeHeaders={["id", "value"]}
                    tableClass={renderInput}
                    renderActions={renderAction}
                    renderInput={renderInput}
                />
            ) : (
                <p className='text-center font-semibold text-[18px] w-full'>No Record Found...</p>
            )}
        </div>
    );
}

export default Sub_Module_Table;