import Phaser from "phaser";

export default class LevelThreeIntro extends Phaser.Scene {
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

    constructor() {
        super({ key: "LoadingScene3" });
    }
    init(data: {
        username: string;
        lvl1: boolean;
        lvl2: boolean;
        lvl3: true;
        lvl4: boolean;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.username = data.username;
    }

    preload() {
        this.load.image("alfredicon", "assets/alfredicon.png");
    }

    create() {
        this.resetScene();

        this.add.rectangle(640, 360, 1280, 720, 0x000);
        this.add.image(150, 100, "alfredicon").setDisplaySize(130, 130);

        //display text
        this.displayNextLine();

        // On enter, transition to Level 3
        this.input.keyboard?.on("keydown-ENTER", () => {
            if (this.contentFullyDisplayed) {
                this.scene.start("LoadingScene3part2", {
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
            "Great job handling those generators, Agent " + this.username + ".",
            "We've breached Yortsed Corp's perimeter, but now we must",
            "delve deeper into the facility itself.",
            " ",
            "Your objective is to locate numerical codes",
            "that Namuh has spread in files across various directories.",
            " ",
            "Once you've gathered them, you'll input these numbers",
            "into the pin-pad to gain access to the inner sanctum.",
            " ",
            " ",
            "You can always run 'man alfred' for additional",
            "assistance to reach the end of a mission.",
            " ",
            "Type in the correct code to access Yortsed Corp's facility.",
            "Time is of the essence, Agent. Good luck.",
            " ",
            " ",
            "                  [Enter] to Continue",
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
        }
    }

    // helper to animate text typing
    typeText(line: string) {
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
