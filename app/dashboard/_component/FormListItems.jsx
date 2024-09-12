import { Button } from '@/components/ui/button'
import { Edit, Share, Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from '@clerk/nextjs'
import { Jsonforms } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { db } from '@/configs'
import { toast } from 'sonner'
import { RWebShare } from 'react-web-share'

const FormListItems = ({ jsonForm, formRecord, RefreshData }) => {
    const { user } = useUser();
    const onDelete = async () => {
        try {
            const result = await db
                .delete(Jsonforms)
                .where(and(
                    eq(Jsonforms.id, formRecord.id),
                    eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress)
                ));

            if (result) {
                toast('Form Deleted!!');
                RefreshData();
            } else {
                toast('Failed to delete form!');
            }
        } catch (error) {
            console.error('Error deleting form:', error);
            toast('An error occurred while deleting the form.');
        }
    };

    return (
        <div className='border shadow-sm rounded-lg p-4'>
            <div className='flex justify-between'>
                <h2></h2>
                <AlertDialog>
                    <AlertDialogTrigger asChild><Trash className='h-5 w-5 text-red-600 cursor-pointer' /></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
            <h2 className='text-lg'>{jsonForm.formTitle}</h2>
            <h2 className='text-sm text-gray-500'>{jsonForm.formSubheading}</h2>
            <hr className='my-4' />
            <div className='flex justify-between'>
                <RWebShare
                    data={{
                        text: jsonForm?.formTitle + " build your own form in sec with ai form builder",
                        url: process.env.NEXT_PUBLIC_BASE_URL + "aiform/" + formRecord.id,
                        title: jsonForm?.formSubheading,
                    }}
                    onClick={() => console.log("shared successfully!")}
                >
                    <Button variant="outline" className="flex gap-2" size="sm"> <Share className='h-4 w-4' />Share</Button>
                </RWebShare>

                <Link href={'/edit-form/' + formRecord?.id}>
                    <Button className="flex gap-2" size="sm"> <Edit className='h-4 w-4' />Edit</Button></Link>
            </div>
        </div>
    )
}

export default FormListItems