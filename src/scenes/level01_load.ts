import Phaser from "phaser";

export default class LoadingScene1 extends Phaser.Scene {
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
    private time1: number;
    private time2: number;
    private time3: number;
    private time4: number;
    private time5: number;
    private username: string;
    private contentFullyDisplayed: boolean; // flag to track if content is fully displayed
    private speaking: Phaser.Sound.BaseSound | undefined; // Sound object for speaking

    constructor() {
        super({ key: "LoadingScene1" });
    }

    init(data: {
        username: string;
        lvl1: boolean;
        lvl2: boolean;
        lvl3: boolean;
        lvl4: boolean;
        time1: number;
        time2: number;
        time3: number;
        time4: number;
        time5: number;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.username = data.username;
        this.time1 = data.time1;
        this.time2 = data.time2;
        this.time3 = data.time3;
        this.time4 = data.time4;
        this.time5 = data.time5;
    }

    preload() {
        this.load.audio("Level1Music", ["assets/Audio/Level1Music.mp3"]);
        this.load.image("alfredicon", "assets/LevelUI/AlfredIcon.png");
    }

    create() {
        let music = this.sound.add("Level1Music", { loop: true });
        music.play();

        this.resetScene();

        this.add.rectangle(640, 360, 1280, 720, 0x000);
        this.add.image(150, 100, "alfredicon").setDisplaySize(130, 130);

        // Display all content
        this.displayNextLine();

        this.add.text(460, 670, "[Enter] to start Level 1", {
            color: "#fff",
            fontSize: "24px",
            fontFamily: "Monospace",
        });

        // On enter, transition to Level 1 if content is fully displayed, otherwise, display next line
        this.input.keyboard?.on("keydown-ENTER", () => {
            if (this.contentFullyDisplayed) {
                if (this.speaking) {
                    this.speaking.stop(); // Stop speaking sound if it's playing
                }
                this.scene.start("Level01", {
                    username: this.username,
                    lvl2: this.lvl2,
                    lvl3: this.lvl3,
                    lvl4: this.lvl4,
                    lvl5: this.lvl5,
                    time1: this.time1,
                    time2: this.time2,
                    time3: this.time3,
                    time4: this.time4,
                    time5: this.time5,
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
        this.contentFullyDisplayed = false;
        this.content = [
            "Your mission, should you choose to accept it,",
            "involves critical file manipulation.",
            " ",
            "You need to navigate to the 'control_room' and",
            "disable the 'surveillance_camera'.",
            " ",
            "Here are the commands at your disposal:",
            " ",
            " - 'ls' to list the contents of the current directory.",
            " ",
            " - 'cd <directory>' to change the current directory.",
            "                    Use 'cd ..' to go back.",
            " ",
            " - 'rm <file> to remove a file from its directory.",
            " ",
            " - 'man <command>' to display the manual for a specific command.",
            " ",
            "You can always run 'man alfred' for additional",
            "assistance to reach the end of a mission.",
            " ",
            "Disable the camera to advance further into Yortsed Corp.",
        ];
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
