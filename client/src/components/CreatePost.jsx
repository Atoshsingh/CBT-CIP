import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import React, { useReducer, useRef, useState } from 'react'
import { Textarea } from './ui/textarea'
import { Input } from 'postcss'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader } from 'lucide-react'
import e from 'cors'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice';


const CreatePost = ({ open, setOpen }) => {

    const {user} = useSelector(store=>store.auth);
    const [file, setFile] = useState("");
    const[loading , setLoading] = useState(false);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const dispatch  = useDispatch();
    const {posts} = useSelector(store=>store.post) ;
 
    const imageRef = useRef();
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }
    const createPostHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) formData.append("image", file);
        try {
          setLoading(true);
          const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          if (res.data.success) {
            dispatch(setPosts([res.data.post, ...posts]));// [1] -> [1,2] -> total element will be 2
            toast.success(res.data.message);
            setOpen(false);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
    }
    return (
        <Dialog open={open} >
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className='text-center font-bold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="Image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 text-xs'>{user?.bio}</span>
                    </div>
                </div>
                <Textarea value={caption} onChange={(e)=> setCaption(e.target.value)} placeholder="Write a caption...." className="focus-visible:ring-transparent border-none" />
                {/* <Input type="file"/> */}
                {
                    imagePreview && (
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                        </div>
                    )
                }
                <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto text-white bg-[#0095F6] hover:bg-[#0578c5] hover:text-black">select from pc</Button>
                {
                    imagePreview && (
                        loading?(
                           <Button>
                             <Loader2 className="mr-2 h-4 w-4 animate-ping"/>
                           </Button>
                        ):( 
                            <Button onClick={createPostHandler} type='submit' className="w-full">Post</Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost;