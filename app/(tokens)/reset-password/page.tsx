import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import React from 'react';
import { db } from "@/lib/db";
import MaxWidthWrapper from '@/components/MaxWithWrapper';
import Heading from '@/components/Heading';
import { redirect } from 'next/navigation';

interface ResetPasswordPageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
    
    if (!searchParams.token) {
        redirect('/') 
    }

    const user = await db.user.findFirst({
        where: {
            resetTokenPassword: searchParams.token as string
        }
    })

    if (!user) {
        redirect('/')
    }

    return (
        <>
            <MaxWidthWrapper className='mt-10'>

                <div className='pt-20 pb-10 mx-auto  text-center flex flex-col items-center max-w-3xl'>
                    <Heading
                        title={`Reset your Password`}
                    />
                    <span>{`${user.email}`}</span>
                </div>
                <div className='flex md:justify-center'>
                    <div className='flex w-full md:w-1/3'>
                        <ResetPasswordForm resetPasswordToken={user.resetTokenPassword as string} />
                    </div>
                </div>
            </MaxWidthWrapper>
        </>

    )

}

export default ResetPasswordPage;