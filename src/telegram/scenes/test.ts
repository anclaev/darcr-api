import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Markup } from 'telegraf'

import {
  MySceneActionContext,
  MySceneContext,
} from '@common/interfaces/telegram'

import { SCENES, ACTION_TEST_OK } from '@common/types/telegram'

@Scene(SCENES.SCENE_CHOOSE_TEST)
export class ChooseTestScene {
  @SceneEnter()
  async enter(@Ctx() ctx: MySceneContext) {
    await ctx.reply(
      'This is a test scene.',
      Markup.inlineKeyboard([
        [
          {
            text: ACTION_TEST_OK.text,
            callback_data: ACTION_TEST_OK.callback,
          },
        ],
      ]),
    )
  }

  @Action(ACTION_TEST_OK.callback)
  async onAnswer(@Ctx() ctx: MySceneActionContext) {
    await ctx.scene.leave()
  }
}
