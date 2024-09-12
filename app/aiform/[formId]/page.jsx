"use client"
import FormUi from '@/app/edit-form/_components/FormUi'
import { db } from '@/configs'
import { Jsonforms } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const LiveAIForm = ({ params }) => {
    const [record, setRecord] = useState();
    const [jsonform, setjsonform] = useState();
    useEffect(() => {
        params && getFormData()
    }, [params])
    const getFormData = async () => {
        const result = await db.select().from(Jsonforms)
            .where(eq(Jsonforms.id, Number(params?.formId)))

        setRecord(result[0]);
        setjsonform(JSON.parse(result[0].jsonForm));
        console.log(result);
    }



    return (
        <div className='p-10 flex justify-center items-center h-screen'
            style={{ backgroundImage: record?.background }}
        >
            {record && <FormUi
                jsonForm={jsonform}
                selectedTheme={record?.theme}
                onFieldUpdate={() => console.log}
                deleteFields={() => console.log}
                editable={false}
                formId={record.id}
                signInEnabled={record?.signInEnabled}
            />
            }
            <Link href={'/'} className='px-3 py-1 fixed rounded-full bg-black text-white bottom-5 left-5 cursor-pointer'>
                Build your Own AI Form
            </Link>
        </div>
    )
}

export default LiveAIForm
