import React from 'react';
import Card from './Card';

const DoingBoard = ({ data }) => {
    return (
        <div className='p-1 bg-[#F2F4F7]'>
            <div className='p-3 flex items-center justify-between'>
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                <span className='p-3 rounded-l-full bg-red-400 mr-1'></span>

                    Doing
                    </h1>
                <span className='p-2 rounded-full bg-gray-200'>{data.length}</span>
            </div>
            <div className=" h-screen overflow-y-auto overflow-x-hidden space-y-4">
                {data.map((card, index) => (
                    <Card key={index} cardData={card} />
                ))}
            </div>
        </div>
    );
};

export default DoingBoard;