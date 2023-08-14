import { User } from '../../entities/User'
import { } from 'typedi'
import { IUserService } from '../IUserService'
import { DataSource, Repository } from 'typeorm'
import { IUserRepo } from '../../repositories/IUserRepo'

export class UserService implements IUserService {

	constructor (
		private readonly userRepo: IUserRepo
	) {
		this.userRepo = userRepo
	}

	public async findOneById (id: number): Promise<User | null> {
		console.log(id)
		return await this.userRepo.findOneById(id)
	}

	public async createOne (user: User): Promise<User | null> {
		console.log(user)
		return await this.userRepo.createOne(user)
	}
}
