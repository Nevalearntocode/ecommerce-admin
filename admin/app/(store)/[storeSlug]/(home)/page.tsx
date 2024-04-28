import { getUserStoreBySlug } from "@/data/get-stores";
import React from "react";
import Empty from "../../../../components/mainpages/empty";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { formatter } from "@/lib/utils";
import { getStoreTotalRevenue } from "@/data/get-store-total-revenue";
import { getStoreSalesCount } from "@/data/get-sales-count";
import { getStockCount } from "@/data/get-stock-count";
import Overview from "./_components/overview";
import { getMonthlyGraphRevenue } from "@/data/get-graph-revenue";
import { getCurrentStaff } from "@/data/get-staffs";
import SalesCard from "./_components/sales-card";
import Home from "./_components/home-product-card";

type Props = {
  params: {
    storeSlug: string;
  };
};

const StorePage = async ({ params }: Props) => {
  const store = await getUserStoreBySlug(params.storeSlug);
  if (!store) {
    return (
      <Empty
        label={`You don't have any store with slug: ${decodeURIComponent(params.storeSlug)}`}
      />
    );
  }

  const staff = await getCurrentStaff(params.storeSlug);
  if (!staff) {
    return (
      <Empty
        label={`You are not a staff of store with slug: ${decodeURIComponent(params.storeSlug)}`}
      />
    );
  }

  const totalRevenue = await getStoreTotalRevenue(store.id);
  const salesCount = await getStoreSalesCount(store.id);
  const products = await getStockCount(store.id);
  const graphData = await getMonthlyGraphRevenue(store.id);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Header title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <SalesCard salesCount={salesCount} />
          <Home products={products} />
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview graphData={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorePage;