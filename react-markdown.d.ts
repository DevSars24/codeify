declare module "react-markdown" {
  import type { ReactNode } from "react";

  export interface ReactMarkdownProps {
    children?: ReactNode;
    components?: Record<string, any>;
  }

  export default function ReactMarkdown(props: ReactMarkdownProps): JSX.Element;
}


