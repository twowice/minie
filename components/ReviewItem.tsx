import { Avatar, Box, Button, Flex, Image, Text } from "@chakra-ui/react";

export default function ReviewItem() {
  return (
    <Flex
      pb={"20px"}
      borderBottom={"1px solid rgba(204,204,204,0.8)"}
      w={"100%"}
      justifyContent={"space-between"}
    >
      <Flex gap={"30px"}>
        <Box>
          <Avatar.Root size={"2xl"} mb={"10px"}>
            <Avatar.Fallback name="따가운 볼" />
            <Avatar.Image src={"/images/test/피카츄.jpeg"} alt="피카츄" />
          </Avatar.Root>
          <Text fontWeight={"500"} color={"black"} fontSize={"12px"}>
            따가운 볼
          </Text>
        </Box>
        <Flex
          direction={"column"}
          textAlign={"left"}
          fontSize={"12px"}
          color={"#5C5C5C"}
          gap={"10px"}
        >
          <Text fontWeight={"500"}>2025.10.23</Text>
          <Text color={"#A8A8A8"}>타임 리페어 인테시브 크림</Text>
          <Box>
            <Text>아이가 아주 만족해하며 잘 쓰고있어요.</Text>
            <Text>피부에 밀착력이 좋고 커버가 잘된다고 해요♡</Text>
          </Box>
          <Image
            src={"/images/test/image36.png"}
            w={"100px"}
            h={"100px"}
            alt=""
          />
        </Flex>
      </Flex>
      <Button
        border={"1px solid #cccccc"}
        w={"100px"}
        p={"0"}
        fontSize={"12px"}
        h={"30px"}
      >
        답변
      </Button>
    </Flex>
  );
}
