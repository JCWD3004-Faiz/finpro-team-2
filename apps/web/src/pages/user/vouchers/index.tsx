import React from 'react'
import { UserSidebar } from '@/components/UserSideBar'

function UserVouchers() {
  return (
    <div className="min-h-screen w-screen bg-white mt-[7vh] p-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <UserSidebar />
              <main className="flex-1">
                <div>
                  <h1 className="text-2xl text-gray-800 font-semibold">Vouchers</h1>
                  <p className="text-muted-foreground">View your available vouchers</p>
                </div>
                <div className="mx-auto py-8 max-w-4xl">

                </div>
              </main>
            </div>
        </div>
    </div>
  )
}

export default UserVouchers