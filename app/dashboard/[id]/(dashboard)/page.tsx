import React from "react";
import { db } from "@/lib/db";
import OverviewComponent from "./_components/overviewComponent";


const CustomDashboardPage = async ({ params }: { params: { id: string } }) => {
  const restaurant = await db.restaurant.findFirst({
    where: {
      id: params.id,
    },
  });

  const orders = await db.order.findMany({
    where: {
      restaurantId: params.id,
      status: 'COMPLETE',
    },
    orderBy: { date: 'desc' },
  });

  const sideExpenses = await db.stock.findMany({
    where : {
      Side : {
        restaurantId : params.id
      },
    }, include : {
      'Stock_Log' : true,
    }
  });


  if (!restaurant) {
    return (
      <div>
        Invalid Resturant
      </div>
    )
  }

  return (
    <div className="space-y-6 p-10 pt-7 pb-16 block">
      <div className="space-y-0.5 md:justify-between md:flex items-center ">
        <h2 className="pt-1.5 text-2xl font-bold tracking-tight">Overview</h2>
      </div>
      <OverviewComponent sideExpenses={sideExpenses} orders={orders} />
    </div >

  );
};



export default CustomDashboardPage;