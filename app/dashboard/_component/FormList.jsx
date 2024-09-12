"use client"

import { db } from '@/configs';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import FormListItems from './FormListItems';

const FormList = () => {
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
        <div className='mt-5 grid grid-cols-2 md:grid-cols-4 gap-5'>
            {
                formlist.map((form, index) => (
                    <div>
                        <FormListItems jsonForm={JSON.parse(form.jsonForm)}
                        formRecord = {form}
                        RefreshData={GetFormList}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default FormList
