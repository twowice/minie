import { OrderForManage } from "@/app/api/order/order";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { Badge, NativeSelect, Table } from "@chakra-ui/react";

export default function OrderItemForManage({
  order,
  handleStatusChange,
}: {
  order: OrderForManage;
  handleStatusChange: (
    orderId: string,
    newStatus: OrderForManage["status"]
  ) => void;
}) {
  const getStatusBadgeColor = (status: OrderForManage["status"]) => {
    switch (status) {
      case "주문완료":
        return "blue";
      case "배송중":
        return "orange";
      case "배송완료":
        return "green";
      case "주문취소":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Table.Row>
      <Table.Cell>{order.id}</Table.Cell>
      <Table.Cell>{order.user}</Table.Cell>
      <Table.Cell>{order.date.replace("T", " ")}</Table.Cell>
      <Table.Cell>{order.orderName}</Table.Cell>
      <Table.Cell>{numberFormatter.format(order.totalPrice)}원</Table.Cell>
      <Table.Cell>
        <Badge colorPalette={getStatusBadgeColor(order.status)}>
          {order.status}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            css={{
              "& option": {
                backgroundColor: "white",
                color: "black",
              },
            }}
            value={order.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleStatusChange(
                order.id,
                e.target.value as OrderForManage["status"]
              )
            }
          >
            <option value="주문완료">주문완료</option>
            <option value="배송중">배송중</option>
            <option value="배송완료">배송완료</option>
            <option value="주문취소">주문취소</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Table.Cell>
    </Table.Row>
  );
}
