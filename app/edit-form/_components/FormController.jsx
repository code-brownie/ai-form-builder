import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Themes from '@/app/_data/Themes'
import GradientColors from '@/app/_data/GradientColors'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const FormController = ({ selectedTheme, selectedBackground,setSignInEnabled}) => {
    const [showMore, setshowMore] = useState(6)

    return (
        <div>
            {/* Theme selection controller */}
            <h2 className='my-10'>Themes</h2>
            <Select onValueChange={(value) => selectedTheme(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {Themes.map((item, index) => (
                        <SelectItem value={item.theme} key={index}>
                            <div className='flex gap-5'>
                                <div className='flex'>
                                    <div className='h-5 w-5 rounded-l-lg'
                                        style={{ backgroundColor: item.primary }}
                                    >
                                    </div>
                                    <div className='h-5 w-5'
                                        style={{ backgroundColor: item.secondary }}
                                    >
                                    </div>
                                    <div className='h-5 w-5'
                                        style={{ backgroundColor: item.neutral }}
                                    >
                                    </div>
                                    <div className='h-5 w-5 rounded-r-lg'
                                        style={{ backgroundColor: item.accent }}
                                    >
                                    </div>
                                </div>
                                {item.theme}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {/* Background selection controller */}
            <h2 className='mt-8 my-1'>Background</h2>
            <div className='grid grid-cols-3 gap-5'
            >
                {GradientColors.map((bg, index) => (index < showMore) && (
                    <div key={index} className='w-full  cursor-pointer h-[70px] rounded-lg hover:border-black hover:border-2 flex items-center justify-center'
                        style={{ background: bg.gradient }}
                        onClick={() => selectedBackground(bg.gradient)}
                    >
                        {index == 0 && "None"}
                    </div>
                ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full my-2" onClick={() => setshowMore(showMore > 6 ? 6 : 20)}>

                {showMore > 6 ? 'Show Less' : 'Show More'}
            </Button>

            <div className='my-5'>
                <Checkbox onCheckedChange={(e)=>setSignInEnabled(e)}/> Enable social auth before submitting the form
            </div>
        </div>
    )
}

export default FormController
