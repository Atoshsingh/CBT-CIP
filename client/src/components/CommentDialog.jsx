// import { Dialog } from '@radix-ui/react-dialog'
import React, { useEffect, useState } from 'react'
import {Send} from 'lucide-react'
import { Dialog,DialogContent ,DialogTrigger} from './ui/dialog'
import { Link } from 'react-router-dom'
import { Avatar ,AvatarImage,AvatarFallback} from './ui/avatar'
import { MoreHorizontal, Slice } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'
const CommentDialog = ({open , setOpen}) => {
    const[text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
      if (selectedPost) {
        setComment(selectedPost.comments);
      }
    }, [selectedPost]);
    const changeEventHandler = (e)=>{
        const inputText = e.target.value;
        if(inputText.trim()){
          setText(inputText);
        }
        else{
          setText("");
        }
      }

    // const sendMessageHandler= async()=>{
    //     alert(text); 
    // }

    const sendMessageHandler = async () => {
      try {
          const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost._id}/comment`, { text }, {
              headers: {
                  'Content-Type': 'application/json'
              },
              withCredentials: true
          });
          console.log(res.data);
          if (res.data.success) {
              const updatedCommentData = [...comment, res.data.comment];
              setComment(updatedCommentData);
  
              const updatedPostData = posts.map(p =>
                  p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
              );
  
              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
              setText("");
          }
      } catch (error) {
          console.log(error);
      }
  }
  
  
  // function func(){
  //   console.log(selectedPost);
  // }
  return (
        <>
        <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  {/* <Button onClick={func}>Click me</Button> */}
                  <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                  {/* <span className='text-gray-600 text-sm'>{selectedPost?.author?.bio}</span> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            {/* <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
              } */}
              <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
              }
              </div>
              <div className=' p-4 flex items-center gap-2'>
                <input onChange={changeEventHandler} className='w-full outline-none border border-gray-300 rounded-2xl  text-sm p-2' placeholder='Add a comment...'/>
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline" className=""><Send/></Button>
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
        </>
  )
}

export default CommentDialog