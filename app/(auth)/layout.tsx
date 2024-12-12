import React from 'react'
import Image from 'next/image'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen'>

      <section className='hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5'>

        <div className='flex flex-col max-h-[800px] max-w-[430px] justify-center space-y-14'>

          <Image src="/assets/icons/Logo.svg" alt='logo' width={190} height={78} className='h-auto' />

          <div className='space-y-5 text-white'>
            <h1 className='h2'>Manage your files the best way</h1>
            <p className='body-1'>
              Awesome we have created the perfext place for you to store all your documents
            </p>
          </div>

          <Image src="/assets/images/Illustration.svg" alt='Illustration' width={300} height={300} className='transition-all hover:rotate-2 hover:scale-105' />

        </div>

      </section>

      <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>

        <div className='mb-16 lg:hidden'>
          <Image src="/assets/icons/Logo_IN_WHITE.svg" alt='logo' width={224} height={82} className='h-auto w-[200px] lg:w-[200px] lg:h-auto' />
        </div>

        {children}

      </section>


    </div>
  )
}

export default layout
