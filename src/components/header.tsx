import styled from "styled-components";

interface HeaderProps {
  title: string;
  subtitle?: string;
  button?: React.ReactNode;
  className?: string;
}

const HeaderContainer = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  grid-row-gap: 1.5rem;
  margin-bottom: 3rem;

  width: 100%;

  & > h1 {
    display: block;
    font-size: 3rem;
    line-height: 2.5rem;
    margin: 0;
  }

  & > p {
    margin: 0;
    font-size: 1.5rem;
  }
`;

export const Header = ({ title, subtitle, button, className }: HeaderProps) => {
  return (
    <HeaderContainer className={className}>
      <h1>{title}</h1>
      {!!button ? button : <span />}
      <p>{subtitle}</p>
    </HeaderContainer>
  );
};
