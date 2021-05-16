import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputProps,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const EpicField = ({ label, ...props }: { label: string } & InputProps) => (
    <Field name={label}>
        {({ field, form }) => (
            <FormControl {...props} mt={4}>
                <FormLabel as="legend" htmlFor={props.id || props.name}>
                    {label}
                </FormLabel>
                <Input {...field} {...props} />
                <FormErrorMessage>{form.errors[label]}</FormErrorMessage>
            </FormControl>
        )}
    </Field>
);

const ShortenerForm = () => {
    const schema = Yup.object({
        url: Yup.string().required().url(),
        code: Yup.string(),
    });

    const onSubmit = (res, actions) => {
        alert(JSON.stringify(res));

        setTimeout(() => actions.setSubmitting(false), 2000);
    };

    return (
        <Formik
            initialValues={{}}
            validationSchema={schema}
            onSubmit={onSubmit}>
            {props => (
                <Form>
                    <EpicField
                        label="Url"
                        name="url"
                        type="text"
                        placeholder="https://example.com"
                        isRequired
                    />
                    <EpicField
                        label="Custom code"
                        name="code"
                        type="text"
                        placeholder="Leave empty to generate"
                    />

                    <Button
                        mt={4}
                        colorScheme="blue"
                        isLoading={props.isSubmitting}
                        type="submit">
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );

    // return <p>form here</p>;
};

export default ShortenerForm;
