import React from 'react'
import { Tabs } from 'antd';
import Products from './Products';
import UserBids from './UserBids';
import { useSelector } from 'react-redux';
import moment from 'moment';


function Profile() {
  const {user} = useSelector((state) => state.users);
  const { TabPane } = Tabs;
  return (
    <div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab="Products" key="1">
          <Products />
        </TabPane>
        <TabPane tab="My Bids" key="2">
          <UserBids />
        </TabPane>
        <TabPane tab="General" key="3">
        <div className='flex flex-col w-1/3'>
          <span className=" text-xl flex justify-between">
            Name: <span className='text-xl'>{user.name}</span></span>
            <span className=" text-xl flex justify-between">
            Email: <span className='text-xl'>{user.email}</span></span>
            <span className=" text-xl flex justify-between">
            Created At:{" "} <span className='text-xl'>{moment(user.createdAt).format("MMM D , YYYY hh:mm A")}</span></span>
        </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Profile