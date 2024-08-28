import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({ comment }) => {
    return (
        <div className='my-2 mt-3'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{comment?.author.username} <span className='font-extralight pl-1 '>{comment?.text}</span></h1>
            </div>
        </div>
    )
}

export default Comment