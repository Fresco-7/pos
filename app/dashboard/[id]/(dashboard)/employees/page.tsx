import React from 'react'
import ProductsActions from './_components/EmployeeActions';
import { db } from '@/lib/db'
import { EmployeeTable } from '@/components/tabels/employee/EmployeeTable';
import { columns } from '@/components/tabels/employee/employeeColumns';
import EmptyState from '@/components/emptyStates/EmptyState';
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'


const EmployeesPage = async ({ params }: { params: { id: string } }) => {
    
    const employees = await db.employee.findMany({
        where: {
            restaurantId: params.id
        }, include: {
            user: true
        }
    });
    return (
        <>
            <div className="space-y-6 p-10 pt-7 pb-16 block">
                <div className="space-y-0.5 md:justify-between md:flex items-center ">
                    <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
                    <div className="md:flex pt-5 md:pt-0">
                        <ProductsActions />
                    </div>
                </div>
                {employees.length ?
                    (
                        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <EmployeeTable columns={columns} data={employees} />
                        </div>
                    ) : (
                        <EmptyState src={svgScr} />

                    )
                }
            </div>

        </>
    )
}

export default EmployeesPage;