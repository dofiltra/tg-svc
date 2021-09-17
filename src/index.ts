import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export type TgBotInfo = {
  token: string
  chatIds: number[] | string[]
  name?: string
}

type TTgBotSendMsg = {
  chatId: string | number
  text: string
  extra?: ExtraReplyMessage
}

type TTgSvcSettings = { bots: TgBotInfo[] }

class TgSvc {
  public selectedBotInfo: TgBotInfo
  private _bot: Telegraf<Context<Update>> | undefined

  constructor({ bots }: TTgSvcSettings) {
    this.selectedBotInfo = this.getSelectedBot(bots)

    if (this.selectedBotInfo) {
      this._bot = new Telegraf(this.selectedBotInfo.token)
    }
  }

  protected getSelectedBot(bots: TgBotInfo[]) {
    return bots[0]
  }

  async sendMessage({ chatId, text, extra }: TTgBotSendMsg) {
    if (!this._bot) {
      return
    }

    try {
      return {
        result: await this._bot.telegram.sendMessage(chatId, text, {
          parse_mode: 'HTML',
          ...extra
        })
      }
    } catch (error: any) {
      return { error }
    }
  }
}

export { TgSvc }
