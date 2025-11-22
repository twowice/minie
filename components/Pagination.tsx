import {
  ButtonGroup,
  IconButton,
  Pagination as ChakraPagination,
  Flex,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function PlainPagination({
  currentPage,
  totalPages,
  handlePageChange,
}: {
  currentPage: number;
  totalPages: number;
  handlePageChange: (changedPage: number) => void;
}) {
  return (
    <Flex justify="center" align="center" p={4}>
      <ChakraPagination.Root
        count={totalPages * 10}
        pageSize={10}
        page={currentPage}
        onPageChange={(e) => handlePageChange(e.page)}
        siblingCount={2}
      >
        <ButtonGroup variant="ghost" size="sm">
          <ChakraPagination.PrevTrigger asChild>
            <IconButton
              color="black"
              _hover={{
                bg: "gray.100",
                color: "black",
              }}
            >
              <LuChevronLeft />
            </IconButton>
          </ChakraPagination.PrevTrigger>

          <ChakraPagination.Items
            render={(page) => (
              <IconButton
                variant="ghost"
                color="black"
                _hover={{
                  bg: "gray.100",
                  color: "black",
                }}
                _selected={{
                  bg: "black",
                  color: "white",
                  _hover: {
                    bg: "gray.300",
                  },
                }}
              >
                {page.value}
              </IconButton>
            )}
          />

          <ChakraPagination.NextTrigger asChild>
            <IconButton
              color="black"
              _hover={{
                bg: "gray.100",
                color: "black",
              }}
            >
              <LuChevronRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </Flex>
  );
}
