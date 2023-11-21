import { GetUserListDto } from '../dtos/get-user-list.dto'

export class GetUserListQuery {
  constructor(public readonly dto: GetUserListDto) {}
}
