"use client";

import { Button, Popover, Portal  } from "@chakra-ui/react";

interface bottomDialogProps {

}

export default function inquiryDialog({ }: bottomDialogProps) {
    return (
        <Popover.Root positioning={{ offset: { crossAxis: 0, mainAxis: 0 } }}>
      <Popover.Trigger asChild>
        <Button style={{ position: "fixed", bottom: "20px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#FA6D6D", color: "#fff", border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", fontSize: "16px", cursor: "pointer", zIndex: 9999, }} > + </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>
              This popover has a custom offset from its trigger
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
    );
}

