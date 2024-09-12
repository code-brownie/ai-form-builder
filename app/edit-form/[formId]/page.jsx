"use client"
import { db } from '@/configs';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm';
import { ArrowLeft, Share, Share2, SquareArrowOutUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import FormUi from '../_components/FormUi';
import { toast } from 'sonner';
import FormController from '../_components/FormController';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RWebShare } from 'react-web-share';

const FormStyle = ({ params }) => {
    const { user } = useUser();
    const [jsonForm, setJsonForm] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState();
    const [record, setRecord] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [selectedBackground, setSelectedBackground] = useState('')
    const router = useRouter();
    useEffect(() => {
        GetFormData();
    }, [user])
    const GetFormData = async () => {
        const result = await db.select().from(Jsonforms)
            .where(and(eq(params?.formId, Jsonforms.id)),
                eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress));
        setRecord(result[0]);
        setJsonForm(JSON.parse(result[0].jsonForm));
        setSelectedBackground(result[0].background);
        setSelectedTheme(result[0].theme);
    }

    useEffect(() => {
        if (updateTrigger) {
            setJsonForm(jsonForm);
            updateFormInDb();
        }
    }, [updateTrigger]);

    const onFieldUpdate = (value, index) => {
        console.log(value, index);
        jsonForm.formFields[index].formLabel = value.label;
        jsonForm.formFields[index].placeholder = value.placeholder;
        setUpdateTrigger(Date.now());
        console.log(jsonForm);
    }

    const updateFormInDb = async () => {
        await db.update(Jsonforms)
            .set({
                jsonForm: jsonForm
            }).where(
                and(
                    eq(Jsonforms.id, record.id),
                    eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress)
                )
            );

        toast('Form Updated')
    }

    const deleteFields = async (indextoRemove) => {
        const result = jsonForm.formFields.filter((item, index) => index != indextoRemove);
        jsonForm.formFields = result;
        setUpdateTrigger(Date.now());

    }
    const updateControllerFields = async (value, columnName) => {
        console.log("Updating field:", columnName, "with value:", value);

        try {
            const result = await db.update(Jsonforms)
                .set({ [columnName]: value })  // Directly use columnName
                .where(
                    and(
                        eq(Jsonforms.id, record.id),
                        eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress)
                    )
                )
                .returning({ id: Jsonforms.id });

            console.log('Update Result:', result);
            toast('Form Updated');
        } catch (error) {
            console.error("Error updating the form:", error);
        }
    };



    return (
        <div className='p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold'
                    onClick={() => router.back()}
                ><ArrowLeft />Back</h2>
                <div className='flex gap-2'>
                    <Link href={'/aiform/' + record.id}>
                        <Button className="flex gap-2"> <SquareArrowOutUpRight className='h-4 w-4' /> Live Preview</Button></Link>
                    <RWebShare
                        data={{
                            text: jsonForm?.formTitle + " build your own form in sec with ai form builder",
                            url: process.env.NEXT_PUBLIC_BASE_URL + "aiform/" + record.id,
                            title: jsonForm?.formSubheading,
                        }}
                        onClick={() => console.log("shared successfully!")}
                    >
                        <Button className="flex gap-2 bg-green-500 hover:bg-green-600"><Share2 className='h-4 w-4' />Share</Button>
                    </RWebShare>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='p-5 border rounded-lg shadow-md'>
                    <FormController selectedTheme={(value) => {
                        updateControllerFields(value, 'theme');
                        setSelectedTheme(value);

                    }}
                        selectedBackground={(value) => {
                            updateControllerFields(value, 'background');
                            setSelectedBackground(value)
                        }}
                        setSignInEnabled={(value) => { updateControllerFields(value, 'signInEnabled'); }}


                    />
                </div>
                <div className='md:col-span-2 border rounded-lg p-5 flex items-center justify-center'
                    style={{ backgroundImage: selectedBackground }}
                >
                    <FormUi jsonForm={jsonForm}
                        onFieldUpdate={onFieldUpdate}
                        deleteFields={(index) => deleteFields(index)}
                        selectedTheme={selectedTheme}
                    />
                </div>
            </div>
        </div>
    )
}

export default FormStyle
