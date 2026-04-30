// component for navigation bar

import Link from "next/link";
import styled from "styled-components";

// styling
const StyledNav = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    border-bottom: 3px solid darkblue;
    font-family: "Arial, Helvetica, sans-serif";
    font-size: calc(15px + 2vw);
    background-color: lightyellow;
`;

const StyledLink = styled(Link)`
    font-family: "Arial, Helvetica, sans-serif";
    font-size: calc(15px + 2vw);
    text-align: center;
    padding: 5px;
    color: darkblue;
`;

// nav bar function
export default function Nav() {
    return (
        <StyledNav>
            <StyledLink href="/">Home</StyledLink>
            <StyledLink href="/taskList">Tasks</StyledLink>
            <StyledLink href="/calendar">Calendar</StyledLink>
        </StyledNav>
    );
}