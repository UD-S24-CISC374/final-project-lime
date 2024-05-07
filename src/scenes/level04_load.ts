import Phaser from "phaser";

export default class LoadingScene4 extends Phaser.Scene {
    private content: string[]; // text to display
    private charDelay: number; // delay between characters
    private lineDelay: number; // delay between lines
    private startX: number; // start X position of the text
    private startY: number; // start Y position of the text
    private currentLine: Phaser.GameObjects.Text; // Text object to display the current line
    private lineIndex: number; // index of the current line
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private lvl5: boolean;
    private username: string;
    private contentFullyDisplayed: boolean; // flag to track if content is fully displayed
    private speaking: Phaser.Sound.BaseSound | undefined; // Sound object for speaking

    constructor() {
        super({ key: "LoadingScene4" });
    }

    init(data: {
        username: string;
        lvl1: boolean;
        lvl2: boolean;
        lvl3: boolean;
        lvl4: boolean;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.username = data.username;
    }

    preload() {
        this.load.audio("Level1Music", ["assets/Audio/Level1Music.mp3"]);
        this.load.image("alfredicon", "assets/LevelUI/AlfredIcon.png");
        this.load.image("cutscene", "assets/Backgrounds/4Cutscene1.png");
    }

    create() {
        this.cameras.main.fadeIn(1000); // Fade in the next scene

        let music = this.sound.add("Level1Music", { loop: true });
        music.play();

        this.resetScene();

        this.add.image(640, 360, "cutscene").setDisplaySize(1280, 720);

        this.add.text(980, 670, "[Enter] to continue", {
            color: "#fff",
            fontSize: "20px",
            fontFamily: "Monospace",
        });

        // Display all content
        this.displayNextLine();

        // On enter, transition to Level 1 if content is fully displayed, otherwise, display next line
        this.input.keyboard?.on("keydown-ENTER", () => {
            if (this.contentFullyDisplayed) {
                if (this.speaking) {
                    this.speaking.stop(); // Stop speaking sound if it's playing
                }
                // In the create method of your scene

                this.cameras.main.fadeOut(300, 0, 0, 0);

                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start("LoadingScene4part2", {
                            username: this.username,
                            lvl2: this.lvl2,
                            lvl3: this.lvl3,
                            lvl4: this.lvl4,
                            lvl5: this.lvl5,
                        });
                    }
                );

                // In the create method of your scene
            } else {
                this.displayAllContent();
            }
        });
    }

    resetScene() {
        // helper to reset intial values on load
        this.charDelay = 30;
        this.lineDelay = 120;
        this.startX = 440;
        this.startY = 630;
        this.lineIndex = 0;
        this.contentFullyDisplayed = false;
        this.content = ["*Namuh and Alfred speaking*"];
    }
    // Helper to display all content at once
    displayAllContent() {
        this.lineIndex = 0;

        this.content.forEach((line) => {
            const textY = this.startY + 22 * this.lineIndex++;
            this.add.text(this.startX, textY, line, {
                fontSize: "24px",
                color: "#fff",
            });
        });
        this.contentFullyDisplayed = true;
    }

    // Helper to display text line by line, calling typeText to animate
    displayNextLine() {
        if (this.lineIndex < this.content.length) {
            const line = this.content[this.lineIndex++];
            // Create a new text object for the current line
            this.currentLine = this.add.text(
                this.startX,
                this.startY + 22 * (this.lineIndex - 1),
                "",
                {
                    fontSize: "24px",
                    color: "#fff",
                }
            );
            // Start typing the line
            this.typeText(line);
        } else if (this.lineIndex === this.content.length) {
            this.contentFullyDisplayed = true;
        }
    }

    // Helper to animate text typing
    typeText(line: string) {
        this.speaking = this.sound.add("speaking", { loop: false });
        this.speaking.play();
        // split the line into characters
        const characters = line.split("");
        let i = 0;
        // add a delayed event for each character
        this.time.addEvent({
            delay: this.charDelay,
            repeat: characters.length - 1,
            callback: () => {
                this.currentLine.text += characters[i++];
                if (i === characters.length) {
                    this.speaking?.stop();

                    // once all characters are added, add a delayed event to display the next line
                    this.time.delayedCall(
                        this.lineDelay,
                        this.displayNextLine,
                        [],
                        this
                    );
                }
            },
            callbackScope: this,
        });
    }
}
