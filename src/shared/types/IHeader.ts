export interface IHeaderRouter {
  name: string
}

export interface IHeaderTabs {
  label: string
  icon?: string
  router: IHeaderRouter
}
