"use client";

import FilterBar from "@/components/FilterBar";
import ShoppingItem from "@/components/ShoppingItem";
import {
  ButtonGroup,
  Container,
  IconButton,
  Pagination,
  SimpleGrid,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import items from "@/data/items.json";

export default function Shopping() {
  return (
    <Container maxW={"7xl"} maxH={"100%"}>
      <FilterBar />
      <SimpleGrid m={"0 auto"} minChildWidth={"250px"} gap={"8px"}>
        {items.map((item) => (
          <ShoppingItem key={item.id} item={item} />
        ))}
      </SimpleGrid>

      {/* pagination */}
      <Pagination.Root
        count={20}
        pageSize={2}
        defaultPage={1}
        m={"0 auto"}
        w={"100%"}
        textAlign={"center"}
        p={"4"}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild color={"black"}>
            <IconButton _hover={{ color: "white" }}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          <Pagination.Items
            color="black"
            render={(page) => (
              <IconButton
                variant={{ base: "ghost", _selected: "outline" }}
                _hover={{ color: "white" }}
              >
                {page.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger asChild color={"black"}>
            <IconButton _hover={{ color: "white" }}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Container>
  );
}
