import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
const Signup = () => {

    const nevigate = useNavigate();
    const[loading , setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value});
    }
    const[input , setInput] = useState({
        username:"",
        email:"",
        password:""
    })
    useEffect(()=>{
        if(user){
            nevigate("/");
        }
    },[])
    const signupHandler = async(e)=>{
        e.preventDefault();
        console.log(input)
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input,{
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if(res.data.success){
                nevigate("/login")
                toast.success(res.data.message);
                setInput({
                    username:"",
                    email:"",
                    password:""
                })
            }     
            
        } catch (error) {
            console.log(error)
            toast.success(error.response.data.message)
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div className='flex items-center w-screen h-screen justify-center bg-[#e4e4e7]'>
            <form onSubmit={signupHandler} action='' className=' bg-white rounded-2xl shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <div className='my-10'>
                        <h1 className='text-center font-bold text-2xl text-yellow-600'>CONNECTSPHERE </h1><br/>
                        <p className='text-sm text-center font-medium'> Create your Account to connect with people </p>
                    </div>
                    <div>
                        <Label className=' font-bold'>Username</Label>
                        <Input onChange={changeEventHandler} type="text" value={input.username} name="username" className="my-2 focus-visible:ring-transparent" />
                    </div>
                    <div>
                        <Label className=' font-bold'>Email</Label>
                        <Input onChange={changeEventHandler} type="email" name="email" value={input.email} className="my-2 focus-visible:ring-transparent" />
                    </div>
                    <div>
                        <Label className=' font-bold'>Password</Label>
                        <Input onChange={changeEventHandler} type="password" name="password" value={input.password} className="my-2 focus-visible:ring-transparent" />
                    </div>
                </div>
                {
                        loading?(
                            <Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'>wait</Loader2>
                            </Button>
                        ):(<Button type="submit" >Signup</Button>)
                    }
                    
                <span className='text-center'>Already have an account ? <Link to="/login" className='text-green-600'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup;