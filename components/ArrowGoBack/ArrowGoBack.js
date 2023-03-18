import React from 'react'
import Link from 'next/link'
import { BsArrowLeftCircle } from 'react-icons/bs';

export default function ArrowGoBack({ btnTxtModal, btnTxtModal2nd, route }) {

    return (
        <div className='d-flex pt-4 pb-3 col-12 col-lg-10 justify-content-center'>
            <div className='d-flex col-11 col-lg-10 justify-content-between align-items-baseline'>
                <div className='d-flex col-lg-6 align-items-baseline'>
                    <div>{btnTxtModal}</div>
                    <div>{btnTxtModal2nd}</div>
                </div>
                {/* <Link href={route} className='arrow-go-back '><BsArrowLeftCircle /></Link> */}
            </div>
        </div>
    )
}
