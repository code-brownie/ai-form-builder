"use client"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { db } from '@/configs'
import { Jsonforms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import { ChartLine, LibraryBig, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const SideNav = () => {
    const path = usePathname();
    const { user } = useUser();
    const [formlist, setFormlist] = useState([]);
    const [freeFormCreated, setFreeFormCreated] = useState(0);
    const menuList = [
        {
            id: 1,
            name: 'MyForm',
            icon: LibraryBig,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Responses',
            icon: MessageSquare,
            path: '/dashboard/responses'
        },
        {
            id: 3,
            name: 'Analytics',
            icon: ChartLine,
            path: '/dashboard/analytics'
        },
        {
            id: 4,
            name: 'Upgrade',
            icon: Plus,
            path: '/dashboard/upgrade'
        }
    ]
    useEffect(() => {
        user && GetFormList();
    }, [user])
    const GetFormList = async () => {
        const result = await db.select().from(Jsonforms)
            .where(eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(Jsonforms.id));
        setFormlist(result);
        const perc = (result.length / 3) * 100;
        setFreeFormCreated(perc);
        console.log("the result", result);
    }
    return (
        <div className='h-screen shadow-md border'>
            <div className='p-5'>
                {menuList.map((menu, index) => (
                    <Link href={menu.path} key={index} className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary
                     hover:text-white rounded-lg cursor-pointer ${path === menu.path && 'bg-primary text-white'}`}>
                        <menu.icon />
                        {menu.name}
                    </Link>
                ))}
            </div>
            <div className="fixed bottom-7 p-6 w-64">
                <Button className="w-full">Create Form</Button>
                <div className='my-7'>
                    <Progress value={freeFormCreated} />
                    <h2 className='text-sm mt-3 text-gray-600'><strong>{formlist.length}</strong> out of <strong>3</strong> Form Created</h2>
                    <h2 className='text-sm mt-3 text-gray-600'>Upgrade Your Plan for unlimited Form Build</h2>
                </div>
            </div>
        </div>
    )
}

export default SideNav
