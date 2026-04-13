
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

export const InvoiceTemplate = () => {
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
                        
                        <Section>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html >
    );
};

export default InvoiceTemplate;


