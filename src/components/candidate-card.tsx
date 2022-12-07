import useSize from "@react-hook/size";
import React, { useRef } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import styled from "styled-components";
import { PDFUpload } from "../utils/types";
import { PDFViewer } from "./pdf-viewer";

const CandidateCardWrapper = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  padding: 1rem;
  width: calc(100% - 2rem);
  background-color: ${(props) =>
    props.isSelected ? `var(--blue)` : `var(--bg-light-grey)`};
  border-radius: 6px;
  overflow: hidden;

  & > div {
    height: 640px;
    overflow-y: scroll;
    /* overflow-x: hidden; */
    border-radius: 10px;
    overscroll-behavior: contain;
  }
  & > span {
    display: flex;
    justify-content: space-between;
    color: ${(props) =>
      props.isSelected ? `var(--white)` : `var(--dark-grey)`};
    font-weight: 700;
    font-size: 20pt;
    margin-top: 10px;
    margin-bottom: 0px;
  }
`;

export const CandidateCard = ({
  data,
  isSelected,
  onClick,
}: {
  data?: PDFUpload;
  isSelected?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const element = useRef(null);
  const [width] = useSize(element);

  return (
    <CandidateCardWrapper
      isSelected={!!isSelected}
      onClick={(e) => onClick?.(e)}
    >
      <div style={{ width: "100%" }} ref={element}>
        {width > 0 && <PDFViewer data={data?.array} width={width} />}
      </div>
      <span>
        {data?.name ?? ""}{" "}
        <AiFillCheckCircle
          color="white"
          size={30}
          style={{ display: isSelected ? "block" : "none" }}
        />
      </span>
    </CandidateCardWrapper>
  );
};
