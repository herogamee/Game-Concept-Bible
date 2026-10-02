declare module '*.ce' {
  const component: import('canvasengine').ComponentFunction;
  export default component;
}
interface ImportMeta {readonly env:{readonly BASE_URL:string}}
