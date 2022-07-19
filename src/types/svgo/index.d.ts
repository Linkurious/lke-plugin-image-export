declare module "svgo/dist/svgo.browser" {
  export function optimize(svg: string, options: any): { data: string };
}
