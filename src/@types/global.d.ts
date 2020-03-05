import Phaser from "phaser";
declare global {
  /**
   * @interface Sence
   * @extends {Phaser.Scene} 在Phaser.Scene的基础上补充了
   * @extends {init}
   * @extends {preload}
   * @extends {create}
   */
  export interface Sence extends Phaser.Scene {
    init?: () => void;
    preload?: () => void;
    create?: () => void;
    // update?: () => void;
  }
}
