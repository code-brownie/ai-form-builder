"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AIChatsession } from '@/configs/AiModal'
import { db } from '@/configs'
import { Jsonforms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const CreateForm = () => {
    const [openDialog, setOpenDailog] = useState(false);
    const [userInput, setuserInput] = useState();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();
    const prompt = " ,On the basis description please give the form in json format with form title,form subheading with form having form field,form name,placeholder name and form label, fieldType,field required in JSON format donot include this ```json in the starting give only the json format.Do not include and extra whitespace and extra newline character as i need it to parse."
    const onCreate = async () => {
        setLoading(true);
        console.log(userInput);
        const result = await AIChatsession.sendMessage("Description:" + userInput + prompt);
        console.log(result.response.text());
        if (result.response.text()) {
            const resp = await db.insert(Jsonforms)
                .values({
                    jsonForm: result.response.text(),
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD/MM/YYYY')
                }).returning({ id: Jsonforms.id });

            console.log("New Form ID:", resp);
            if (resp[0].id) {
                router.push('/edit-form/' + resp[0].id);
            }
            setLoading(false);
        }
        setLoading(false);
    }
    return (
        <div>
            <Button onClick={() => setOpenDailog(true)}>Create Form</Button>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            <Textarea className="my-2" placeholder="write description of your form"
                                onChange={(e) => setuserInput(e.target.value)}
                            />
                            <div className='flex gap-3 justify-end my-3'>
                                <Button
                                    onClick={() => setOpenDailog(false)}
                                    variant="destructive">cancel</Button>
                                <Button onClick={onCreate} disabled={loading}>
                                    {
                                        loading ? <Loader2 className='animate-spin'/> : 'Create'
                                    }
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm