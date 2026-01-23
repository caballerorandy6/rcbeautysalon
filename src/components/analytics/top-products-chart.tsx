"use client"

import { Card, Title, Text, BarList, Flex } from "@tremor/react"
import { TopProduct } from "@/lib/interfaces"

interface TopProductsChartProps {
  data: TopProduct[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.map((product) => ({
    name: product.name,
    value: product.sales,
    revenue: product.revenue,
  }))

  return (
    <Card className="h-full p-4 sm:p-6">
      <Title>Top Products</Title>
      <Text className="text-muted-foreground">By units sold</Text>

      {data.length > 0 ? (
        <>
          <Flex className="mt-6 border-b border-border pb-2">
            <Text className="font-medium">Product</Text>
            <Text className="font-medium">Units Sold</Text>
          </Flex>
          <BarList
            data={chartData}
            className="mt-4"
            color="amber"
            showAnimation
          />
          <div className="mt-6 space-y-2">
            {data.map((product) => (
              <Flex key={product.name} justifyContent="between">
                <Text className="truncate text-sm text-muted-foreground">
                  {product.name}
                </Text>
                <Text className="text-sm font-medium">
                  ${product.revenue.toLocaleString()}
                </Text>
              </Flex>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 flex h-32 items-center justify-center">
          <Text className="text-muted-foreground">No data available</Text>
        </div>
      )}
    </Card>
  )
}
