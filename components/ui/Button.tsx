import { Button } from "@chakra-ui/react"

export function PrimaryButton() {
    return (
        <Button color={'white'} bgColor={'#FA6D6D'}></Button>
    )
}

export function SecondaryButton() {
    return (
        <Button color={'black'} bgColor={'rgba(255,255,255,0.2)'} border={'1px solid rgba(0,0,0,0.2)'}></Button>
    )
}