import { TaskProps } from "@/types";
import styled from "styled-components";

const StyledMain = styled.div`
    background-color: lavender;
    display: flex;
    flex-direction: column;
    
    #TaskTitle {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(5px + 1.2vw);
    }
    
    #TaskCategory {
        
    }
    
    
    
`;
export default function TaskPreview({ task} : {task: TaskProps}) {
    return (
        <StyledMain>
            <h2 id="TaskTitle">{task.title}</h2>
            <h4 id="TaskCategory">{task.category}</h4>
            <h5 id="TaskDescription">{task.description}</h5>
            <h4 id="TaskDueDate">{new Date(task.deadline). toLocaleDateString()}</h4>
        </StyledMain>
    );
}