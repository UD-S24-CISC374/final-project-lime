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
import LevelThreeIntro from "./scenes/lvl03_intro";
import LevelThreeIntro2 from "./scenes/LevelThreeIntro2";
import Level03 from "./scenes/lvl03Main";

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
