import { SceneContext } from 'telegraf/typings/scenes'
import { Action, Ctx, Start, Update } from 'nestjs-telegraf'
import { Markup } from 'telegraf'

import { ACTION_TEST, SCENES } from '@common/types/telegram'
import { MySceneContext } from '@interfaces/telegram'

@Update()
export class TelegramUpdate {
  constructor() {}

  @Start()
  async start(@Ctx() ctx: MySceneContext) {
    try {
      await ctx.reply('Hi!')
      await ctx.reply(
        'This is a bot for tracking patrols and accidents.',
        Markup.inlineKeyboard([
          [
            {
              text: ACTION_TEST.text,
              callback_data: ACTION_TEST.callback,
            },
          ],
        ]),
      )
    } catch (e) {
      return e
    }
  }

  @Action(ACTION_TEST.callback)
  async startTestScene(@Ctx() ctx: SceneContext) {
    try {
      await ctx.answerCbQuery()
      await ctx.scene.enter(SCENES.SCENE_CHOOSE_TEST)
    } catch (e) {
      return e
    }
  }
}
