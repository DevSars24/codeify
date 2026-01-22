declare module "react-syntax-highlighter" {
  const SyntaxHighlighter: any;
  export { SyntaxHighlighter as Prism };
  export default SyntaxHighlighter;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const oneDark: any;
  export const vscDarkPlus: any;
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  export const vscDarkPlus: any;
}
