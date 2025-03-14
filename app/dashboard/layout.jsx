import { SignedIn } from '@clerk/nextjs'
import React from 'react'
import SideNav from './_component/SideNav'

const DashboardLayout = ({ children }) => {
    return (
        <SignedIn>
            <div>
                <div className='md:w-64 fixed'>
                    <SideNav />
                </div>
                <div className='md:ml-64'>
                    {children}
                </div>

            </div>
        </SignedIn>
    )
}

export default DashboardLayout
