import React, { useEffect, useState } from 'react';
import { BsStack } from 'react-icons/bs';
import { GrAttachment } from 'react-icons/gr';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { LiaCalendar } from 'react-icons/lia';
import Modal from 'react-modal';

const image_hosting_key = import.meta.env.VITE_IMAGE_KEY;
const image_hosting_url = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Card = ({ cardData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [attachmentLength, setAttachmentLength] = useState(0);



    const getAttachmentLength = () => {
        fetch(`https://todo-server-opal.vercel.app/attachment?clientId=${cardData.id}`)
            .then(res => res.json())
            .then(data => setAttachmentLength(data.length))
    }


    useEffect(() => {
        getAttachmentLength()
    }, [])
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFileToUpload(null);
        setFilePreview(null);
    };

    useEffect(() => {
        fetch(`https://todo-server-opal.vercel.app/attachment?clientId=${cardData.id}`)
            .then(response => response.json())
            .then(data => setAttachments(data))
            .catch(error => console.error("Error fetching attachments:", error));
    }, [cardData.id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToUpload(file);
            const fileURL = URL.createObjectURL(file);
            setFilePreview(fileURL);
        }
    };

    const handleFileUpload = async () => {
        if (!fileToUpload) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', fileToUpload);

        try {
            const imgbbResponse = await fetch(image_hosting_url, {
                method: 'POST',
                body: formData
            });

            const imgbbData = await imgbbResponse.json();

            if (imgbbData.success) {
                const uploadedFileUrl = imgbbData.data.url;

                const fileData = {
                    name: fileToUpload.name,
                    extension: fileToUpload.type,
                    url: uploadedFileUrl,
                    clientId: cardData.id
                };

                await fetch('https://todo-server-opal.vercel.app/attachment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fileData)
                });

                setAttachments(prev => [...prev, fileData]);
            } else {
                console.error('Failed to upload to ImgBB');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
            getAttachmentLength()
        }
    };

    return (
        <div className="w-[360px] bg-white shadow-md rounded p-4 border border-gray-200">


            <div className="flex items-center justify-between mb-2">
                <div className=' flex items-center gap-2'>
                    <span className='p-3 bg-gray-400 rounded-full'></span>
                    <h3 className="text-lg font-bold">{cardData.clientName}</h3>
                </div>
                <div className=' flex items-center gap-2'>
                    <span className='p-3 bg-gray-400 rounded-full'></span>
                    <span className="text-sm text-gray-500">{cardData.assignedTo}</span>
                </div>
            </div>

<div className=' flex items-start gap-2'>

<BsStack className='text-gray-600 text-sm' />

    
<p className="text-sm text-gray-600 mb-3">


        {cardData.description}
        
        </p>
</div>
            <div className="flex items-center justify-between text-gray-500 text-sm">
                <span className='flex items-center gap-1 bg-gray-300 rounded-full py-1 px-2'>
                    <strong>{cardData.tasks}</strong>+
                </span>
                <span className='flex items-center gap-1'>
                    <IoChatbubblesOutline /> <strong>{cardData.comments}</strong>
                </span>
                <span className='flex items-center gap-1'>
                    <GrAttachment
                        className='cursor-pointer w-5 h-5'
                        onClick={openModal}
                    />
                    <strong>{attachmentLength}</strong>
                </span>
                <span className='flex items-center gap-1'>
                    <LiaCalendar />
                    <strong>{cardData.dueDate}</strong>
                </span>
            </div>

            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Attachment Modal">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{cardData.clientName}</h2>
                    <button onClick={closeModal} className="text-gray-500">X</button>
                </div>
                <div className='flex flex-col justify-between h-[90%]'>


                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Existing Attachments</h3>
                        <ul className="space-y-5">
                            {attachments.length > 0 ? (
                                attachments.map((attachment, index) => (
                                    <li key={index} className="flex items-center justify-between px-12 ">
                                        <span className='text-xl font-bold'>{attachment.name}</span>
                                        <img
                                            src={attachment.url}
                                            alt="File Preview"
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                        <a
                                            href={attachment.url}
                                            target='_blank'
                                            className="text-blue-500 hover:underline"
                                        >
                                            Preview
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <p>No attachments found</p>
                            )}
                        </ul>
                    </div>



                    <div>

                        <h3 className="text-lg font-semibold text-center mb-2">Upload New Attachment</h3>
                        <div className='flex items-center justify-center gap-5'>

                            {filePreview && (
                                <div className="">
                                    <img
                                        src={filePreview}
                                        alt="File Preview"
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </div>
                            )}

                            <div className="">
                                <input
                                    multiple
                                    type="file"
                                    onChange={handleFileChange}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <button
                                    onClick={handleFileUpload}
                                    disabled={isUploading || !fileToUpload}
                                    className={`p-2 rounded bg-blue-500 ml-2 text-white ${isUploading ? 'opacity-50' : ''}`}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default Card;
