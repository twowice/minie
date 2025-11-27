"use client";
import { useState } from "react";
import { Button, Popover, Portal, Image, Box, Tabs } from "@chakra-ui/react";
import TabOneContent from "@/components/BottomDiaOne";
import TabTwoContent from "@/components/BottomDiaTwo";
import TabThreeContent from "@/components/BottomDiaThree";

interface bottomDialogProps { }

export default function inquiryDialog({ }: bottomDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const handleToggle = () => { setOpen((prev) => !prev); };

  return (
    <Popover.Root positioning={{ offset: { crossAxis: 0, mainAxis: 0 } }} closeOnInteractOutside={false}>
      <Popover.Trigger asChild>
        <Button
          onClick={handleToggle}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "1px solid #FA6D6D",
            backgroundColor: "#fff",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontSize: "16px",
            cursor: "pointer",
            zIndex: 9999,
            transform: isPressed ? "scale(1.2)" : "scale(1)"
          }}
          _active={{
            transform: "scale(1.2)",
          }}>
          <Image
            src={open ? "/images/main/logo1_2.png" : "/images/main/logo1_1.png"}
            alt="chat icon"
            width="34px"
            height="34px"
          />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w="350px"
            h="500px"
            p="0"
            borderRadius="16px"
            boxShadow="0 6px 20px rgba(0,0,0,0.15)"
            bg="#fff"
            marginBottom="15px"
            marginRight="10px"
            display="flex"
            flexDirection="column"
          >
            <Box flex="1" overflowY="auto" p="15px">
              <Tabs.Root
                variant="enclosed"
                defaultValue="tab-1"
              >
                <Tabs.Content w="320px" h="410px" borderRadius="10px" p="10px" marginBottom="10px" value="tab-1">
                  <TabOneContent />
                </Tabs.Content>

                <Tabs.Content w="320px" h="410px" borderRadius="10px" p="10px" marginBottom="10px" value="tab-2">
                  <TabTwoContent />
                </Tabs.Content>

                <Tabs.Content w="320px" h="410px" borderRadius="10px" p="10px" marginBottom="10px" value="tab-3">
                  <TabThreeContent />
                </Tabs.Content>

                <Box
                  position="sticky"
                  zIndex={10}
                >
                  <Tabs.List bg="white" alignItems="center" display="flex" width="100%">
                    <Tabs.Trigger flex="1" value="tab-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 11.5L12 4L21 11.5V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 20.5523 15 20V15C15 14.4477 14.5523 14 14 14H10C9.44772 14 9 14.4477 9 15V20C9 20.5523 8.55228 21 8 21H4C3.44772 21 3 20.5523 3 20V11.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Tabs.Trigger>
                    <Tabs.Trigger flex="1" value="tab-2">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 16.5H6c-.5 0-.8-.6-.5-1l1.1-1.6c.3-.4.4-.9.4-1.4v-2.1c0-2.3 1.6-4.2 3.8-4.7v-.4a1.2 1.2 0 1 1 2.4 0v.4a4.8 4.8 0 0 1 3.8 4.7v2.1c0 .5.1 1 .4 1.4l1.1 1.6c.3.4 0 1-.5 1z" />
                        <path d="M10 17.5c0 1.1.9 2 2 2s2-.9 2-2" />
                      </svg>

                    </Tabs.Trigger>
                    <Tabs.Trigger flex="1" value="tab-3">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.79 13.22C19.9 12.82 19.98 12.41 19.98 12C19.98 11.59 19.9 11.18 19.79 10.78L21.39 9.54C21.57 9.39 21.62 9.13 21.5 8.92L19.5 5.47C19.38 5.26 19.14 5.17 18.91 5.23L16.98 5.78C16.48 5.39 15.93 5.07 15.33 4.84L15.1 2.82C15.07 2.59 14.88 2.42 14.65 2.42H9.34C9.11 2.42 8.92 2.59 8.88 2.82L8.66 4.84C8.05 5.08 7.5 5.41 7 5.8L5.08 5.24C4.84 5.18 4.61 5.29 4.49 5.51L2.49 8.96C2.37 9.19 2.43 9.46 2.63 9.61L4.21 10.84C4.1 11.24 4.03 11.63 4.03 12.05C4.03 12.45 4.1 12.86 4.21 13.26L2.62 14.49C2.43 14.64 2.36 14.9 2.48 15.13L4.48 18.57C4.6 18.8 4.84 18.9 5.07 18.85L6.99 18.3C7.49 18.69 8.04 19.01 8.64 19.24L8.87 21.26C8.9 21.49 9.09 21.66 9.32 21.66H14.63C14.86 21.66 15.05 21.49 15.09 21.26L15.31 19.24C15.92 19 16.47 18.67 16.97 18.28L18.89 18.84C19.12 18.9 19.36 18.79 19.48 18.57L21.48 15.12C21.6 14.89 21.55 14.63 21.36 14.48L19.79 13.22Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Tabs.Trigger>
                  </Tabs.List>
                </Box>
              </Tabs.Root>
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>

    </Popover.Root>
  );
}

