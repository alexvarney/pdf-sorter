import useSize from "@react-hook/size";
import React, { useRef } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import styled from "styled-components";
import { PDFUpload } from "../utils/types";
import { PDFViewer } from "./pdf-viewer";

const CandidateCardWrapper = styled.div<{
  isSelected: boolean;
  selectable: boolean;
}>`
  justify-self: stretch;
  align-self: stretch;
  overflow: hidden;

  display: grid;
  height: 100%;

  grid-template-rows: 1fr auto;

  padding: 1rem;
  background-color: ${(props) =>
    props.isSelected ? `var(--blue)` : `var(--bg-light-grey)`};
  border-radius: 6px;

  cursor: ${(props) => (props.selectable ? "pointer" : "default")};
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

const OuterPDFWrapper = styled.div`
  position: relative;
  height: 100%;
  overflow-x: scroll;
  overscroll-behavior: contain;
`;

const InnerPDFWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

export const CandidateCard = ({
  data,
  isSelected,
  onClick,
  enableLinks,
}: {
  data?: PDFUpload;
  isSelected?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  enableLinks?: boolean;
}) => {
  const element = useRef(null);
  const [width] = useSize(element);

  return (
    <CandidateCardWrapper
      isSelected={!!isSelected}
      onClick={(e) => onClick?.(e)}
      selectable={onClick !== undefined}
    >
      <OuterPDFWrapper>
        <InnerPDFWrapper ref={element}>
          {width > 0 && (
            <PDFViewer
              data={data?.array}
              width={width}
              enableLinks={!!enableLinks}
            />
          )}
        </InnerPDFWrapper>
      </OuterPDFWrapper>
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
