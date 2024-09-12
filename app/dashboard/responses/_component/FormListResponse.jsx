import { Button } from '@/components/ui/button'
import { db } from '@/configs'
import { userResponses } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import * as XLSX from 'xlsx';

const FormListResponse = ({ jsonForm, formRecord }) => {
    let jsondata = [];
    const [loading, setLoading] = useState(false);
    const ExportData = async () => {
        setLoading(true);
        const result = await db.select().from(userResponses)
            .where(eq(userResponses.formRef, formRecord.id));
        console.log(result);
        if (result) {
            result.forEach((item) => {
                const jsonItems = JSON.parse(item.jsonResponse);
                jsondata.push(jsonItems);
            })
            console.log("jd", jsondata);
            setLoading(false);
        }
        exportToExcel(jsondata);
    }

    const exportToExcel = (jsondata) => {
        const worksheet = XLSX.utils.json_to_sheet(jsondata);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, jsonForm?.formTitle + ".xls");
    }
    return (
        <div className='border shadow-sm rounded-lg p-4'>
            <h2 className='text-lg'>{jsonForm.formTitle}</h2>
            <h2 className='text-sm text-gray-500'>{jsonForm.formSubheading}</h2>
            <hr className='my-4' />
            <div className='flex justify-between'>
                <h2 className='text-sm'><strong>45</strong> Responses</h2>
                <Button className="" size="sm" onClick={() => { ExportData() }} disabled={loading}>{loading ? <Loader2 className='animate-spin' /> : 'Export'}</Button>
            </div>
        </div>
    )
}

export default FormListResponse