import React from 'react'
import CreateForm from './_component/CreateForm';
import FormList from './_component/FormList';

const Dashboard = () => {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl flex items-center justify-between'>Dashboard
        <CreateForm />
      </h2>
      {/* list of forms */}
      <FormList />
    </div>
  )
}

export default Dashboard;
