import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    chakra,
    CloseButton,
    useClipboard,
    useColorModeValue,
} from "@chakra-ui/react";

export const ButtonToast = ({
    status,
    variant,
    id,
    title,
    isClosable,
    onClose,
    description,
    toCopy,
}) => {
    const { hasCopied, onCopy } = useClipboard(toCopy);

    return (
        <Alert
            status={status}
            variant={variant}
            id={id}
            alignItems="start"
            borderRadius="md"
            boxShadow="lg"
            paddingEnd={8}
            textAlign="start"
            width="auto"
            pos="relative">
            <AlertIcon />
            <chakra.div flex="1">
                {title && <AlertTitle>{title}</AlertTitle>}
                {description && (
                    <AlertDescription display="block">
                        {description}
                    </AlertDescription>
                )}
            </chakra.div>
            {isClosable && (
                <CloseButton
                    size="sm"
                    onClick={onClose}
                    position="absolute"
                    insetEnd={1}
                    top={1}
                />
            )}
            <Button
                bg={useColorModeValue("green.600", "green.300")}
                pos="absolute"
                right={0}
                bottom={0}
                m={1}
                size="sm"
                onClick={onCopy}>
                {hasCopied ? "Copied" : "Copy"}
            </Button>
        </Alert>
    );
};
