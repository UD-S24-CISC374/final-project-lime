import Phaser from "phaser";

export default class LoadingScene5part5 extends Phaser.Scene {
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
        super({ key: "LoadingScene5part5" });
    }
    init(data: {
        username: string;
        lvl1: boolean;
        lvl2: boolean;
        lvl3: true;
        lvl4: boolean;
        lvl5: boolean;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.lvl5 = data.lvl5;
        this.username = data.username;
    }

    preload() {
        this.load.audio("Level3Music", ["assets/Audio/Level3Music.mp3"]);

        this.load.image("spyicon", "assets/LevelUI/AlfredIcon.png");
    }

    create() {
        let music = this.sound.add("Level3Music", { loop: true });
        music.play();
        this.resetScene();

        this.add.rectangle(640, 360, 1280, 720, 0x000);
        this.add.image(150, 100, "spyicon").setDisplaySize(130, 130);

        //display text
        this.displayNextLine();

        this.add.text(460, 670, "[Enter] to continue", {
            color: "#fff",
            fontSize: "24px",
            fontFamily: "Monospace",
        });

        // On enter, transition to Level 3
        this.input.keyboard?.on("keydown-ENTER", () => {
            if (this.contentFullyDisplayed) {
                if (this.speaking) {
                    this.speaking.stop(); // Stop speaking sound if it's playing
                }
                this.scene.start("Level05", {
                    username: this.username,
                    lvl2: this.lvl2,
                    lvl3: this.lvl3,
                    lvl4: this.lvl4,
                    lvl5: this.lvl5,
                });
            } else {
                this.displayAllContent();
            }
        });
    }

    resetScene() {
        // helper to reset intial values on load
        this.charDelay = 30;
        this.lineDelay = 120;
        this.startX = 250;
        this.startY = 90;
        this.lineIndex = 0;
        this.content = [
            " ",
            " ",
            " ",
            "To get out of this room I must hack the",
            " ",
            "computer system and execute the open_door file.",
            " ",
            " ",
            " ",
            "If I remeber correctly, Alfred taught me that I can",
            " ",
            "execute files by using ./ followed by the file name.",
            " ",
            " ",
            " ",
            "For example, to execute the file:",
            " ",
            "open_door.out",
            " ",
            "I would type:",
            " ",
            "./open_door.out",
            " ",
            " ",
            "Executable files are marked with a .out tag.",
        ];
    }

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

    // helper to display text line by line, calling typeText to animate
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

    // helper to animate text typing
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
