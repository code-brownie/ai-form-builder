import React, { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

const FormEdit = ({ defaultValues, onUpdate, deleteFields }) => {
    const [label, setLabel] = useState(defaultValues?.formLabel);
    const [placeholder, setPlaceHolder] = useState(defaultValues?.placeholder);
    return (
        <div className='flex gap-2 items-center'>

            <Popover>
                <PopoverTrigger><Edit className='h-4 w-4 text-gray-500' /></PopoverTrigger>
                <PopoverContent>
                    <h2>Edit Fields</h2>
                    <div>
                        <label className='text-xs'>Label Name</label>
                        <Input type="text" defaultValue={defaultValues.formLabel}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className='text-xs'>PlaceHolder</label>
                        <Input type="text" defaultValue={defaultValues.placeholder}
                            onChange={(e) => setPlaceHolder(e.target.value)}
                        />
                    </div>
                    <Button size="sm" className="mt-2"
                        onClick={() => onUpdate({
                            label: label,
                            placeholder: placeholder
                        })}
                    >Update</Button>
                </PopoverContent>
            </Popover>
            <AlertDialog>
                <AlertDialogTrigger><Trash className='h-4 w-4 text-red-500' /></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your fields
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(index)=>deleteFields(index)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </div>
    )
}

export default FormEdit