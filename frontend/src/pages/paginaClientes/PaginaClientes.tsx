import React from "react";
import { BoxNavigationClientes, DefaultHeader } from "../../shared/components";

export class PaginaClientes extends React.Component {
  render() {
      return (
        <>
          <DefaultHeader />
          <BoxNavigationClientes />
        </>
      );
  }
}