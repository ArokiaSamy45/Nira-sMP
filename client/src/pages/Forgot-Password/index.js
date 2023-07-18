import React, {Component } from 'react';
import Divider from '../../components/Divider';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { Button, message } from 'antd';
import { ForgotPasswords } from '../../apicalls/users';

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = this.state;
    console.log(email);
    try {
      const response = await ForgotPasswords(email); // Use the separate API function
      console.log(response, "userRegister");
      console.log("Response status:", response.status)
      if (response.status.trim() === "Email sent successfully") {
        alert("Email sent successfully");
        window.location.href = '/login';
      } else if (response.status === "User not found") {
        alert("User not found");
      }
    } catch (error) {
      console.error(error);
    }
  };
  render() {
  return (
    <div className='h-screen bg-primary flex justify-center items-center'>
      <div className='bg-white p-5 rounded w-[350px]'>
        <h1 className='text-primary text-2xl'>
          Nira's Market
        </h1>
        <Divider />
        <form onSubmit={this.handleSubmit}>
          <h2 className='text-primary'>Forgot Password</h2>

          <div className='mb-3'>
            <label>Email address</label>
            <input
              type='email'
              className='form-control'
              placeholder='Enter your email address'
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>

          <div className='d-grid'>
            <Button type="primary" htmlType="submit" block className='mt-2'>
              Submit
            </Button>
          </div>
          <p className='forgot-password text-right'>
            <a href='/login'>Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
}
}


