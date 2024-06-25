"use client";
import React, { FC } from "react";

import { JSONTree } from "react-json-tree";
interface JsonViewerProps {
  json: any;
}
const JsonViewer: FC<JsonViewerProps> = ({ json }) => {
  return (
    <JSONTree data={json} theme={{ base0E: "#ae81ff" }} invertTheme={false} />
  );
};

export default JsonViewer;
