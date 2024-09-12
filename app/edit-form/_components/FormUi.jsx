import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import FormEdit from './FormEdit';
import { Button } from '@/components/ui/button';
import { db } from '@/configs';
import moment from 'moment';
import { toast } from 'sonner';
import { userResponses } from '@/configs/schema';
import { SignInButton, useUser } from '@clerk/nextjs';

const FormUi = ({ jsonForm, onFieldUpdate, deleteFields, selectedTheme, editable = true, formId = 0, signInEnabled = false }) => {
    if (!jsonForm || !jsonForm.formFields) {
        return <Loader2 className='animate-spin' />;
    }
    console.log("se", signInEnabled)
    const { user, isSignedIn } = useUser();
    const [formData, setFormData] = useState();
    let formRef = useRef();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }
    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)

        const result = await db.insert(userResponses).values
            ({
                jsonResponse: formData,
                createdAt: moment().format('DD/MM/YYYY'),
                formRef: formId
            })

        if (result) {
            formRef.reset();
            toast('Response Submitted Successfully');
        } else {
            toast('Error while submitting the form!!')
        }
    }
    const handleCheckBoxChange = (fieldName, itemName, value) => {
        const list = formData?.[fieldName] ? formData?.[fieldName] : [];
        if (value) {
            list.push({
                label: itemName,
                value: value
            })
            setFormData({
                ...formData,
                [fieldName]: list
            })
        } else {
            const result = list.filter((item) => item.label == itemName);
            setFormData({
                ...formData,
                [fieldName]: result
            })
        }
        console.log(result);
    }
    return (
        <form className='border p-5 md:w-[600px]' data-theme={selectedTheme} onSubmit={handleSubmit}
            ref={(e) => formRef = e}
        >
            <h2 className='font-bold text-center text-2xl'>{jsonForm?.formTitle}</h2>
            <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.formSubheading}</h2>

            {jsonForm?.formFields.map((field, index) => (
                <div key={index} className='my-3 flex items-center gap-3'>
                    {field?.fieldType === 'select' ? (
                        <div className='w-full'>
                            <label className='text-xs text-gray-500'>{field?.formLabel}</label>
                            <Select onValueChange={(value) => handleSelectChange(field.fieldName, value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field?.options?.map((opt, idx) => (
                                        <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : field?.fieldType === 'checkbox' ? (
                        <div className='flex gap-2 my-2 w-full'>
                            <label className='text-xs text-gray-500'>{field?.label}</label>
                            {field?.options ? (
                                field?.options.map((opt, idx) => (
                                    <div key={idx} className='flex items-center gap-2'>
                                        <Checkbox value={opt}
                                            onCheckedChange={(v) => handleCheckBoxChange(field?.label, opt.label, v)}
                                        />
                                        <span>{opt}</span>
                                    </div>
                                ))
                            ) : (
                                <Checkbox />
                            )}
                        </div>
                    ) : field?.fieldType === 'radio' ? (
                        <div className='flex flex-col gap-2 my-2 w-full'>
                            <label className='text-xs text-gray-500'>{field?.formLabel}</label>
                            {field?.options?.map((opt, idx) => (
                                <div key={idx} className='flex items-center gap-2'>
                                    <input
                                        type="radio"
                                        name={field.fieldName}
                                        value={opt}
                                        className='form-radio'
                                        required={field?.fieldRequired}
                                        onClick={() => handleSelectChange(opt.fieldName, opt.label)}
                                    />
                                    <span>{opt}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col w-full'>
                            <label className='text-xs text-gray-500 mb-1'>{field?.formLabel}</label>
                            <Input
                                required={field?.fieldRequired}
                                type={field?.fieldType}
                                placeholder={field.placeholder}
                                name={field.fieldName}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                    )}
                    <div>
                        {editable && <FormEdit defaultValues={field}
                            onUpdate={(value) => onFieldUpdate(value, index)}
                            deleteFields={() => deleteFields(index)}
                        />}
                    </div>
                </div>
            ))}

            {!signInEnabled ? (
                <Button type="submit" className="btn btn-primary">Submit</Button>
            ) : (
                isSignedIn ? (
                    <Button type="submit" className="btn btn-primary">Submit</Button>
                ) : (
                    <Button>
                        <SignInButton mode="modal">Sign In Before Submit</SignInButton>
                    </Button>
                )
            )}

        </form>
    );
}

export default FormUi;
