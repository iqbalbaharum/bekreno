import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserChannelRepository} from '../repositories';

@bind({scope: BindingScope.SINGLETON})
export class UserChannelService {
  constructor(
    @repository(UserChannelRepository) protected userChannelRepository: UserChannelRepository
  ) {}

  async tagged(refId: string, channels: string[]) : Promise<void> {

    const userChannel = await this.userChannelRepository.findOne({
      where: {
        refUserId: refId
      }
    })

    if(!userChannel) {
      await this.userChannelRepository.create({
        refUserId: refId,
        channels: channels
      })

      return
    }

    userChannel.channels?.push(...channels!)
    userChannel.updatedAt = new Date()

    await this.userChannelRepository.updateById(userChannel.id, userChannel)
  }

  async untagged(refId: string, channels: string[]) : Promise<void> {

    const userChannel = await this.userChannelRepository.findOne({
      where: {
        refUserId: refId
      }
    })

    if(!userChannel) {
      return
    }

    let bUpdate = false
    for(const channel of channels!) {
      const foundIndex = userChannel.channels?.indexOf(channel)
      if(foundIndex !== -1) {
        userChannel.channels?.splice(foundIndex!, 1)
        bUpdate = true
      }
    }

    if(bUpdate) {
      userChannel.updatedAt = new Date()
      await this.userChannelRepository.updateById(userChannel.id, userChannel)
    }

  }
}
