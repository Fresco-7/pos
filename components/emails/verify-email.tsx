import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface VercelInviteUserEmailProps {
    email?: string;
    name?: string;
    verifyEmailToken: string;

}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

export const VerifyEmailTemplate = ({ email, name, verifyEmailToken }: VercelInviteUserEmailProps) => {
    const previewText = `Verify your email in Pos Kitchen`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`https://i.postimg.cc/Nj48fgV9/svg.png`}
                                width="40"
                                height="37"
                                alt="Pos Kitchen"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Verify your <strong>{'email'}</strong> in <strong>POS Kitchen</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {name},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Verify your email in Pos Kitchen.
                        </Text>
                        <Section>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link href={`${process.env.BASE_URL}/verify-email/${verifyEmailToken}`}>
                                <Button
                                    className="bg-blue-500 rounded text-white text-[12px] font-semibold no-underline text-center px-3 py-4"
                                    href={`${process.env.BASE_URL}/verify-email/${verifyEmailToken}`}
                                >
                                    Verify Email
                                </Button>
                            </Link>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser :{' '}
                            <Link
                                href={`${process.env.BASE_URL}/verify-email/${verifyEmailToken}`}
                                className="text-blue-600 no-underline"
                            >
                                {`${process.env.BASE_URL}/verify-email/${verifyEmailToken}`}
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html >
    );
};

export default VerifyEmailTemplate;
