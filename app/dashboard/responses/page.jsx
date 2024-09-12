"use client"
import { db } from '@/configs';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import FormListResponse from './_component/FormListResponse';

const Responses = () => {
    const { user } = useUser();
    const [formlist, setFormlist] = useState([]);
    useEffect(() => {
        user && GetFormList();
    }, [user])
    const GetFormList = async () => {
        const result = await db.select().from(Jsonforms)
            .where(eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(Jsonforms.id));
        setFormlist(result);
        console.log("the result", result);
    }
    return (
        <div className='p-8'>
            <h2 className='font-bold text-3xl flex items-center justify-between'>
                Responses
            </h2>
            <div className='my-5 grid grid-cols-2 lg:grid-cols-3 gap-3'>
                {
                    formlist && formlist.map((form, index) => (
                        <div>
                            <FormListResponse jsonForm={JSON.parse(form.jsonForm)}
                                formRecord={form}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Responses
