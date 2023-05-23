declare module "svgo/dist/svgo.browser" {
  export function optimize(svg: string, options: unknown): { data: string };
}
