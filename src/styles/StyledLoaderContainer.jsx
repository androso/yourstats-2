import styled from "styled-components";
import React from "react";
import variables from "./variables";

const StyledLoaderContainer = styled.div`
  /* we calculate the height based on the viewport - margins of main - avg size of button log out */
  height: calc(100vh - var(--spacing-xxl) - 80px); 
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .lds-ellipsis {
	display: flex;
	position: relative;
	width: 80px;
	height: 20px;
	margin-left: 8px;
  }
  .lds-ellipsis div {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--green);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 24px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 48px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }

  .
`



export default StyledLoaderContainer;