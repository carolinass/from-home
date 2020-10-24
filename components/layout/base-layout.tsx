import { StatusBar } from "expo-status-bar";
import { Content, Body, Container, Header, Left, Title, Right } from "native-base";

type HeaderProps = {
  title: string
}

export const BaseLayout: React.FC<HeaderProps> = ({ children, title }) => (
  <Container>
    <StatusBar translucent={false} />
    <Header>
      <Left/>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right />
    </Header>
    <Content>
        {children}
    </Content>
  </Container>
)