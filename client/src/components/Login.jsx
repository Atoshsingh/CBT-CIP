import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
const Login = () => {

    const nevigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth);
    const[loading , setLoading] = useState(false);
    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value});
    }
    const[input , setInput] = useState({
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
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input,{
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if(res.data.success){
                nevigate("/")
                dispatch(setAuthUser(res.data.user));
                toast.success(res.data.message);
                setInput({
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
            <form  onSubmit={signupHandler} action='' className='bg-white shadow-lg flex flex-col gap-5 p-8 rounded-2xl'>
                <div className='my-4'>
                    <div className='my-7'>
                        <h1 className='text-center font-bold text-2xl text-yellow-600'>CONNECTSPHERE</h1>
                        <br/>
                        <p className='text-sm text-center font-medium'> Enter your credentials to connect with people</p>
                    </div>
                    <div>
                        <Label className='font-bold'>Email</Label>
                        <Input onChange={changeEventHandler} type="email" name="email" value={input.email} className="my-2 focus-visible:ring-transparent" />
                    </div>
                    <div>
                        <Label className=' font-bold'>Password</Label>
                        <Input onChange={changeEventHandler} type="password" name="password" value={input.password} className="my-2 focus-visible:ring-transparent" />
                    </div>
                </div>
                    {
                        loading?(
                            <Button >
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'>wait</Loader2>
                            </Button>
                        ):(<Button type="submit">Login</Button>)
                    }
                    <span className='text-center text-red-500'>Doesn't have an account ? <Link to="/signup" className='text-green-600'>Signup</Link></span>
                    <span className='bg-white text-center text-red-500 cursor-pointer hover:text-red-300' >Forgot password? <Link className='text-green-600 '>Recover it</Link></span>
            </form>
        </div>
    )
}

export default Login;