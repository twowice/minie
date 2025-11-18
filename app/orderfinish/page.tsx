import { Box, Container } from "@chakra-ui/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function OrderFinishPage() {
  return (
    <Container
      bg={"white"}
      display={"flex"}
      flexDirection={"column"}
      maxW="7xl"
      py={"24px"}
      gap={"10px"}
      color={"black"}
      px={{ base: 4, sm: 6, lg: 8 }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        paddingBottom={"34px"}
      >
        <Box fontWeight={"semibold"} fontSize={"32px"}>
          주문완료
        </Box>
        <Box display={"flex"} gap={"8px"} alignItems={"center"}>
          <Box color={"#B2B2B2"} fontSize={"16px"}>
            01 장바구니
          </Box>
          <MdOutlineArrowForwardIos color={"#B2B2B2"} size={"15px"} />
          <Box fontSize={"16px"} color={"#B2B2B2"}>
            02 주문/결제
          </Box>
          <MdOutlineArrowForwardIos color={"#B2B2B2"} size={"15px"} />
          <Box fontSize={"16px"}>03 주문완료</Box>
        </Box>
      </Box>
    </Container>
  );
}
