import Link from "next/link";
import styled from "styled-components";

const StyledNav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    border-bottom: 3px solid black;
    font-family: "Arial, Helvetica, sans-serif";
    font-size: calc(15px + 2vw);
`;

const StyledLink = styled(Link)`
    font-family: "Arial, Helvetica, sans-serif";
    font-size: calc(15px + 2vw);
    text-align: center;
    padding: 5px;
`;
export default function Nav() {
    return (
        <StyledNav>
            <StyledLink href="/">Home</StyledLink>
            <StyledLink href="/tasks">Tasks</StyledLink>
            <StyledLink href="/calendar">Calendar</StyledLink>
        </StyledNav>
    );
}