import React from "react";
import { StyledLoaderContainer } from "../styles";

const Loader = () => (
  <StyledLoaderContainer>
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </StyledLoaderContainer>
)

export default Loader;