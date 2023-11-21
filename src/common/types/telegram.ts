import { MyAction } from '@common/interfaces/telegram'

export const ACTION_TEST: MyAction = {
  text: 'Test',
  callback: 'test',
}

export const ACTION_TEST_OK: MyAction = {
  text: 'Nice',
  callback: 'test_ok',
}

export enum SCENES {
  SCENE_CHOOSE_TEST = 'SCENE_CHOOSE_TEST',
}
