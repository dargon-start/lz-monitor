import APIClient from '../request'
import { Organization } from './org.type'

export function getOrgList(params: any) {
  return APIClient.get<Organization[]>({
    url: '/org/list',
    params
  })
}
