import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    clickCountText: Phaser.GameObjects.Text;
    clickButton: Phaser.GameObjects.Text;
    constructor() {
        super({ key: "TitleScene" });
    }

    init() {}

    preload() {
        this.load.image("titlescreen", "assets/CyberSpyTitleScreen.png");
        this.load.audio("menuMusic", ["assets/Audio/menuMusic.mp3"]);
        this.load.image("cityBackground", "assets/Backgrounds/city2s.png");
    }

    create() {
        let menuMusic = this.sound.add("menuMusic", { loop: true });
        menuMusic.play();
        // menuMusic.setSeek(10);
        const cityBackground1 = this.add
            .tileSprite(0, -128, 0, 0, "cityBackground")
            .setOrigin(0, 0);

        const cityBackground2 = this.add
            .tileSprite(cityBackground1.width, -128, 0, 0, "cityBackground")
            .setOrigin(0, 0);

        // Animate city backgrounds to move from right to left infinitely
        this.tweens.add({
            targets: [cityBackground1, cityBackground2],
            x: "-=" + cityBackground1.width,
            duration: 40000, // Adjust duration as needed
            repeat: -1,
        });
        this.add.image(640, 300, "titlescreen");
        this.clickButton = this.add
            .text(515, 440, "[Enter] to Start", {
                color: "#fff",
                fontSize: "25px",
                fontFamily: "Monospace",
            })
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("LoginScene");
            })
            .on("pointerover", () => {
                this.enterButtonHoverState();
            })
            .on("pointerout", () => {
                this.enterButtonRestState();
            });

        this.clickButton.setStroke("#000000", 6);

        this.input.keyboard?.once("keydown-ENTER", () => {
            this.scene.start("LoginScene");
        });
    }

    enterButtonHoverState() {
        this.clickButton.setStyle({ fill: "#ff0" });
    }

    enterButtonRestState() {
        this.clickButton.setStyle({ fill: "#fff" });
    }

    update() {}
}
