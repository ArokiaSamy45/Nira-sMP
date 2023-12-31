import React, { useEffect } from 'react'
import {Form, Input, Button, message }from 'antd'
import { Link, useNavigate} from 'react-router-dom'
import Divider from '../../components/Divider';
import { LoginUser} from '../../apicalls/users'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';


const rules = [
  {  required:true,
    message:'required'
  }
]

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true))
      const response = await LoginUser(values);
      dispatch(SetLoader(false))
      if (response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.data);
        window.location.href = '/';
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error("Login failed. Please check your credentials and try again.");
    }
    };

    useEffect(() => {
      if(localStorage.getItem('token')) {
        navigate ('/')
      }
    }, []);


  return (
    <div
    className='h-screen bg-primary flex justify-center items-center'>
        <div className='bg-white p-5 rounded w-[350px]'>
            <h1 className='text-primary text-2xl'>NIRA's Market - <span className='text-gray-400 text-2xl '>LOGIN</span></h1>
          <Divider/>
           <Form
           layout="vertical"
           onFinish={onFinish}>
      
            <Form.Item label='Email' name='email' rules={rules}>
                <Input placeholder='Email'/>
            </Form.Item>
            <Form.Item label='Password' name='password' rules={rules}>
                <Input type="password" placeholder='Password'/>
            </Form.Item>
            <p className="forgot-password text-right">
          Forgot <a href="/reset">password?</a>
        </p>
            <Button type="primary" htmlType="submit" block className='mt-2'>Login</Button>
         <div className='mt-5 text-center'>
         <span className='text-gray-500'>Don't have an account? <Link to="/register">Register</Link></span>

         </div>
                    </Form>
            </div>
        </div>
  )
}

export default Login