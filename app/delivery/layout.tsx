import { Box, Button, Flex, Menu } from "@chakra-ui/react";

export default function delivery({ children }: { children: React.ReactNode }) {
  return (
    <Flex>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button>버튼</Button>
        </Menu.Trigger>
      </Menu.Root>
      <Box>{children}</Box>
    </Flex>
  );
}
