import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("ClosedBook", "assets/LevelUI/ClosedBook.png");
        this.load.image("HoveredBook", "assets/LevelUI/HoveredBook.png");
        this.load.image("OpenBook", "assets/LevelUI/OpenBook.png");
        this.load.image("titlescreen", "assets/CyberSpyTitleScreen.png");
        this.load.image("alfred", "assets/Characters/alfred.png");
        this.load.image("alfredicon", "assets/LevelUI/AlfredIcon.png");
        this.load.image("spyicon", "assets/Characters/SpyIcon.png");
        this.load.image("pin", "assets/LevelUI/pin.png");
        this.load.image("ground", "assets/Platform.png");
        this.load.image("prompt", "assets/LevelUI/PromptBox.png");
        this.load.image("backArrow", "../assets/backArrow.png");

        this.load.image(
            "closed_metal_door",
            "assets/LevelSelect/closed_metal_door.png"
        );
        this.load.image("lockedDoor", "assets/LevelSelect/lockedDoor.png");
        this.load.image("arrow", "assets/LevelSelect/arrow.png");
        this.load.image(
            "backwardsDoor",
            "assets/LevelSelect/backwardsDoor.png"
        );
        this.load.image("wallDoor", "assets/LevelSelect/wallDoor.png");
        this.load.image(
            "open_metal_door",
            "assets/LevelSelect/open_metal_door.png"
        );
        this.load.image("bomb", "assets/LevelUI/bomb.png");
        this.load.image("screen", "assets/Backgrounds/screen.png");
        this.load.spritesheet("dude", "assets/Characters/dude.png", {
            frameWidth: 240,
            frameHeight: 405,
        });

        this.load.audio("speaking", ["assets/Audio/speaking.mp3"]);
        this.load.audio("ding", ["assets/Audio/ding.mp3"]);
        this.load.audio("cdDing", ["assets/Audio/cdDing.mp3"]);
        this.load.audio("lsDing", ["assets/Audio/lsDing.mp3"]);
        this.load.audio("cdBackDing", ["assets/Audio/cdBackDing.mp3"]);
        this.load.audio("manDing", ["assets/Audio/manDing.mp3"]);
        this.load.audio("rmDing", ["assets/Audio/rmDing.mp3"]);
        this.load.audio("alfredDeathMusic", [
            "assets/Audio/AlfredDeathMusic.mp3",
        ]);
        this.load.audio("winChime", ["assets/Audio/winChime.mp3"]);
        this.load.audio("jump", ["assets/Audio/jump.wav"]);
        this.load.audio("walk", ["assets/Audio/walking.wav"]);
        this.load.audio("menuMusic", ["assets/Audio/menuMusic.mp3"]);
    }

    create() {
        this.scene.start("LevelSelect");
    }
}
