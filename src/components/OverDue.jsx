import React from 'react';
import Card from './Card';

const OverDue = ({ data }) => {
    return (
        <div className='p-1 bg-[#F2F4F7]'>
              <div className='p-3 flex items-center justify-between'>
            <h1 className="text-2xl font-bold mb-4">Over Due </h1>
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

export default OverDue;