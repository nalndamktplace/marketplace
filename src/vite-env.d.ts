/// <reference types="vite/client" />
declare module "*.epub" {
  const value: string; // Adjust the type based on the content of your .epub file
  export default value;
}
