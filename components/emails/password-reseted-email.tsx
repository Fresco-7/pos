
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
    userName: string
}

export const ResetedPassowrdEmailTemplate = ({ userName }: VercelInviteUserEmailProps) => {
    return (
        <Html>
            <Head />
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
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {userName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            The password for your POS Kitchen account was successfully changed.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you did not authorize this change, please contact POS Kitchen Team as soon as possible.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Best Regards,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            POS Kitchen.
                        </Text>
                        <Section>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html >
    );
};

export default ResetedPassowrdEmailTemplate;