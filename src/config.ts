import Phaser from "phaser";
import TitleScene from "./scenes/titleScene";
import PreloadScene from "./scenes/preloadScene";
import TerminalScene from "./scenes/terminalScene";
import LevelSelect from "./scenes/levelSelect";
import Level01 from "./scenes/level01";
import LoadingScene1 from "./scenes/level01_load";
import IntroScene from "./scenes/intro";
import LoginScene from "./scenes/login";
import Tutorial from "./scenes/tutorial";
import SecurityBreachScene from "./scenes/securityBreach";
import Level2Scene from "./scenes/level02";
import LoadingScene2 from "./scenes/level02_load";
import LoadingScene2Part2 from "./scenes/level02_load2";
import LevelThreeIntro from "./scenes/level03_load";
import LevelThreeIntro2 from "./scenes/level03_load2";
import Level03 from "./scenes/level03";
import LoadingScene4 from "./scenes/level04_load";
import LoadingScene4part2 from "./scenes/level04_load2";
import LoadingScene4part3 from "./scenes/level04_load3";
import LoadingScene4part4 from "./scenes/level04_load4";
import LoadingScene5 from "./scenes/level05_load";
import LoadingScene5part2 from "./scenes/level05_load2";
import LoadingScene5part3 from "./scenes/level05_load3";
import LoadingScene5part4 from "./scenes/level05_load4";
import LoadingScene5part5 from "./scenes/level05_load5";
import Level4Scene from "./scenes/level04";
import Level5Scene from "./scenes/level05";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
export const CONFIG = {
    title: "Cyber Spy",
    version: "0.0.1",
    type: Phaser.AUTO,
    backgroundColor: "#ffffff",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [
        PreloadScene,
        TitleScene,
        LevelSelect,
        TerminalScene,
        Level01,
        LoadingScene1,
        IntroScene,
        LoginScene,
        Tutorial,
        Level2Scene,
        LoadingScene2,
        LoadingScene2Part2,
        LevelThreeIntro,
        LevelThreeIntro2,
        Level03,
        SecurityBreachScene,
        LoadingScene4,
        LoadingScene4part2,
        LoadingScene4part3,
        LoadingScene4part4,
        LoadingScene5,
        LoadingScene5part2,
        LoadingScene5part3,
        LoadingScene5part4,
        LoadingScene5part5,
        Level4Scene,
        Level5Scene,
    ],

    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 300 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
};
