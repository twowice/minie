import { Accordion, Flex, Text } from "@chakra-ui/react";

export default function ProductQna() {
  const review = [
    {
      value: "info",
      title: "상품상세문의",
      subtitle: "구매확정 문의",
      status: "답변완료",
      userid: "따가운 볼",
      date: "2025.10.23",
      product: "타임 리페어 인텐시브 크림",
      content: `이벤트 응모할려고 오늘 아침에 상품 구매를 했는데 구매확정 상태여야 응모가 가능하더라구요.
        배송을 받아야 구매확정이 가능한데 26일까지 배송을 못받을수도 있을거같은데 미리 구매확정 처리가 가능한가요..?`,
      commenttitle: "답변.",
      comment: `안녕하세요 고객님,
        피부 고민을 함께하는 Minié입니다.
        
        이번 이벤트와 관련하여 혼란을 드린 점 진심으로 사과드립니다.
        현재 티켓 관련 추가 안내를 준비 중이며,
        금일 중으로 넘버즈인 공식 인스타그램 계정, 인스타그램 스토리, 트위터를 통해 공지될 예정입니다.
        조금만 기다려 주시면 감사하겠습니다.
        
        추가로 궁금하신 사항이 있으실 경우,
        카카오톡 @Minié으로 편하게 문의 부탁드립니다.
        
        감사합니다.`,
      commentdate: "2025.10.23",
    },
    {
      value: "info",
      title: "상품상세문의",
      subtitle: "기존 제품과의 차이",
      status: "답변 대기중",
      userid: "불타는 스킨",
      date: "2025.10.23",
      product: "타임 리페어 인텐시브 크림",
      content:
        "기존의 수딩 미스트 토너를 잘 사용하고있는데요~ 이제품이 새로 나왔다해서요~ 성분차이는 당연히 있겠지만 여드름에는 이 제품이 더 낫나요, 아니면 새로나온 이 제품이 더 나을까요?",
      commenttitle: "",
      comment: "",
    },
  ];

  return (
    <Accordion.Root variant={"outline"} mt={"10px"} multiple w={"100%"} p={0}>
      {review.map((item, index) => (
        <Accordion.Item key={index} value={item.value} p={"16px 32px"}>
          <Accordion.ItemTrigger
            justifyContent={"space-between"}
            w={"100%"}
            borderRadius={0}
          >
            <Flex direction={"column"} gap={"8px"}>
              <Text color={"#5c5c5c"} fontSize={"16px"}>
                {item.title}
              </Text>
              <Text color={"black"} fontSize={"20px"}>
                {item.subtitle}
              </Text>
              <Flex
                gap={"10px"}
                color={"#5c5c5c"}
                fontSize={"12px"}
                fontWeight={"500"}
              >
                <Text w={"80px"}>{item.status}</Text>
                <Text color={"black"}>{item.userid}</Text>
                <Text>{item.date}</Text>
              </Flex>
            </Flex>
            <Accordion.ItemIndicator color={"black"} />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent
            bgColor={"rgba(204,204,204,0.5)"}
            borderRadius={0}
            color={"#A9A9A9"}
            p={0}
          >
            <Accordion.ItemBody
              textAlign={"left"}
              p={"16px 32px"}
              borderBottom={"1px solid #cccccc"}
              borderTop={"1px solid #cccccc"}
            >
              <Text mb={"8px"}>{item.product}</Text>
              <Text color={"#5C5C5C"} whiteSpace="pre-line">
                {item.content}
              </Text>
            </Accordion.ItemBody>
            {(item.comment || item.commenttitle) && (
              <Accordion.ItemBody
                textAlign={"left"}
                p={"16px 32px"}
                borderBottom={"1px solid #cccccc"}
              >
                <Text mb={"8px"}>{item.commenttitle}</Text>
                <Text mb={"8px"} color={"#5C5C5C"} whiteSpace="pre-line">
                  {item.comment}
                </Text>
                <Text>{item.commentdate}</Text>
              </Accordion.ItemBody>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
