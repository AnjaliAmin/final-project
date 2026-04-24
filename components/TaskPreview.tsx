import { TaskProps } from "@/types";
import styled from "styled-components";

const StyledMain = styled.div`
    background-color: lavender;
    display: flex;
    flex-direction: column;
    border: 3px solid darkblue;
    margin: 5px;
    padding-top: 1%;
    padding-bottom: 1%;
    
    #TaskTitle {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(10px + 1.2vw);
        border-bottom: 2px solid darkblue;
        text-align: center;
    }
    
    #TaskCategory {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(8px + 1.2vw);
        border-bottom: 1px solid darkblue;
        padding: 1%;
    }
    
    #TaskDescription {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(6px + 1.5vw);
        border-bottom: 1px solid darkblue;
        padding: 1%;
    }
    
    #TaskDueDate {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(8px + 1.2vw);
        padding: 1%;
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