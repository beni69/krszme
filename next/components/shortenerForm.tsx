import { Box, ButtonGroup, Link, useToast } from "@chakra-ui/react";
import { Formik, FormikHelpers } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { newLink } from "../lib/api";
import { ButtonToast } from "./toastWithButton";

const ShortenerForm = () => {
    const router = useRouter();
    const { query } = router;

    if (!router.isReady) return null;

    console.debug({ query });

    const toast = useToast({
        status: "error",
        variant: "solid",
        position: "bottom",
        isClosable: true,
    });

    const validationSchema = Yup.object({
        dest: Yup.string().required("Missing url").url("Not a valid url"),
        code: Yup.string()
            .matches(
                /^[\w\d\.]{3,32}$/,
                "Custom code must be between 3 and 32 letters, numbers and dots."
            )
            .nullable(),
    });

    const initialValues = {
        dest: query.url || "",
        code: query.code || null,
    };

    const onSubmit = async (values: any, actions: FormikHelpers<any>) => {
        console.info(values);

        const res = await newLink(values);
        const data = await res.json();

        actions.setSubmitting(false);

        if (data?.error || !res?.ok) {
            switch (data?.code) {
                case 10001:
                    toast({
                        title: "Error while creating link",
                        description:
                            "The url you provided is not a valid link.",
                    });
                    break;
                case 10002:
                    toast({
                        title: "Error while creating link",
                        description:
                            "The custom code must contain between 3 and 32 characters, that can be letters, numbers and a dot.",
                    });
                    break;
                case 10003:
                    toast({
                        title: "Error while creating link",
                        description: "The code you provided is already in use.",
                    });
                    break;
                case 10004:
                    toast({
                        title: "Error while creating link",
                        description: "Custom code is a reserved word.",
                    });
                    break;

                case 429:
                    toast({
                        title: "You are creating links too quickly",
                        description:
                            "Who knew shortening links can be so addictive?",
                    });
                    break;

                default:
                    toast({
                        title: "Unknown error",
                        description:
                            "An unknown error occured, and your request failed.",
                    });
                    break;
            }
            return console.error("krsz.me api error:", JSON.stringify(data));
        }

        console.info("krsz.me api response", data);

        toast({
            status: "success",
            title: "Link created!",
            description: (
                <Link href={data.url} target="_blank">
                    {data.url}
                </Link>
            ),
            render: function ({ onClose, id }) {
                return (
                    <ButtonToast
                        status="success"
                        variant="solid"
                        title={this.title}
                        description={this.description}
                        isClosable
                        onClose={onClose}
                        id={id}
                        toCopy={data.url}
                    />
                );
            },
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}>
            {({ handleSubmit, values, errors }) => (
                <Box
                    as="form"
                    onSubmit={handleSubmit as any}
                    autoComplete="off"
                    w={56}>
                    <InputControl
                        name="dest"
                        label="Url"
                        inputProps={{ placeholder: "https://example.com" }}
                    />
                    <InputControl
                        name="code"
                        label="Custom code"
                        inputProps={{
                            placeholder: "Leave empty to generate",
                        }}
                    />

                    <ButtonGroup mt={5}>
                        <SubmitButton colorScheme="blue">Create</SubmitButton>
                    </ButtonGroup>
                </Box>
            )}
        </Formik>
    );
};

export default ShortenerForm;
