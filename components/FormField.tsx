import { Box, Text, Input, InputProps } from "@chakra-ui/react"

interface FormFieldProps extends InputProps {
  label: string;
  placeholder?: string; //placeholder에서 ?가 붙은 이유는 필수 항목이 아니기 때문.
  error?: string;
}

export default function FormField({ label, placeholder, error, ...props }: FormFieldProps) {  // ...props는 나중에 뭐가 들어올지 모르니까, 들어오는 거 다 받아서 그대로 전달한다는 뜻
  return(
    <Box w="full">
      <Text
        color="#000000" 
        fontSize="16px" 
        fontWeight="bold" 
        height="32px"
        px="4px"
        display="flex"
        alignItems="center"
        justifyContent="start"
      >
        {label}  
      </Text>
      <Input
        w="full" 
        placeholder={placeholder}
        border="1px solid"
        borderRadius="4px"
        borderColor="rgba(0, 0, 0, 0.3)"
        color="#000000"
        height="48px"
        _focus={{
          outline: "none",
          borderColor: "#FA6D6D",
          borderWidth: "2px"
        }}
        {...props}
      />
      {error && <Text fontSize="sm" color="red.500" mt={1}>{error}</Text>}
    </Box>
  )
}