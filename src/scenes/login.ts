import Phaser from "phaser";

export default class LoginScene extends Phaser.Scene {
    private stateText: Phaser.GameObjects.Text;
    private inputField: HTMLInputElement;
    private inputContainer: Phaser.GameObjects.Container;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    clickButton: Phaser.GameObjects.Text;
    private content: string[]; // text to display
    private charDelay: number; // delay between characters
    private lineDelay: number; // delay between lines
    private startX: number; // start X position of the text
    private startY: number; // start Y position of the text
    private currentLine: Phaser.GameObjects.Text; // Text object to display the current line
    private lineIndex: number; // index of the current line

    constructor() {
        super({ key: "LoginScene" });
    }

    init(data: { lvl1: boolean; lvl2: boolean; lvl3: boolean; lvl4: boolean }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
    }
    preload() {}

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x000);

        let lsDing = this.sound.add("cdDing", { loop: false });

        this.resetScene();

        this.displayNextLine();

        // Add text input field
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.position = "absolute";
        this.inputField.style.width = "600px";
        this.inputField.style.height = "40px";
        this.inputField.style.fontSize = "20px";
        this.inputField.style.top = "50%";
        this.inputField.style.left = "50%";
        this.inputField.style.backgroundColor = "#000";
        this.inputField.style.color = "#fff";
        this.inputField.placeholder = "Enter Username"; // Placeholder text
        this.inputField.style.border = "2px solid gold";
        this.inputField.style.borderRadius = "10px";

        const accessGranted = this.add.text(480, 400, "ACCESS GRANTED", {
            color: "gold",
            fontSize: "32px",
            fontFamily: "Monospace",
        });

        this.inputField.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.inputField);

        this.add.text(410, 59, "", {
            color: "#fff",
            fontSize: "17px",
            fontFamily: "Monospace",
        });

        const loadingBars = [
            this.add.rectangle(360, 430, 80, 20, 0xffd700),
            this.add.rectangle(400, 430, 160, 20, 0xffd700),
            this.add.rectangle(440, 430, 240, 20, 0xffd700),
            this.add.rectangle(480, 430, 320, 20, 0xffd700),
            this.add.rectangle(520, 430, 400, 20, 0xffd700),
            this.add.rectangle(560, 430, 480, 20, 0xffd700),
            this.add.rectangle(600, 430, 560, 20, 0xffd700),
            this.add.rectangle(640, 430, 640, 20, 0xffd700),
            this.add.rectangle(640, 430, 640, 20, 0xffd700),
        ];

        // Set all loading bars initially invisible
        loadingBars.forEach((bar) => {
            bar.visible = false;
        });

        // Index to keep track of which loading bar to show
        let currentBarIndex = 0;

        accessGranted.visible = false;

        // Append the button to the body or any desired container

        this.clickButton = this.add
            .text(570, 420, "LOGIN", {
                color: "#000",
                fontSize: "25px",
                fontFamily: "Monospace",
                backgroundColor: "gold",
                padding: {
                    left: 25,
                    right: 25,
                    top: 10,
                    bottom: 10,
                },
            })
            .setInteractive()
            .on("pointerdown", () => {
                const username = this.inputField.value;

                this.inputField.value = ""; // Empty the input field
                this.clickButton.visible = false;

                // Play sound
                lsDing.play();

                this.input.keyboard?.removeListener("keydown", enterListener);

                this.removeInputField();

                // Function to show the next loading bar and schedule its hiding
                const showNextLoadingBar = () => {
                    // Show the current loading bar
                    loadingBars[currentBarIndex].visible = true;

                    // Increment the index for the next loading bar
                    currentBarIndex++;

                    // If all loading bars have been shown, return
                    if (currentBarIndex >= loadingBars.length) {
                        if (currentBarIndex >= loadingBars.length) {
                            accessGranted.visible = true;

                            loadingBars[8].visible = false;

                            this.time.delayedCall(2200, () => {
                                if (username === "admin") {
                                    this.sound.stopAll();
                                    this.scene.start("LevelSelect", {
                                        username: username,
                                    });
                                } else {
                                    this.scene.start("IntroScene", {
                                        username: username,
                                    });
                                }
                            });

                            return;
                        }
                    }

                    this.time.delayedCall(100, () => {
                        loadingBars[currentBarIndex - 1].visible = false;

                        showNextLoadingBar();
                    });
                };

                showNextLoadingBar();
            })
            .on("pointerover", () => {
                this.enterButtonHoverState();
            })
            .on("pointerout", () => {
                this.enterButtonRestState();
            });

        // Keyboard event listener for the Enter key
        const enterListener = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                const username = this.inputField.value;

                this.inputField.value = ""; // Empty the input field
                this.clickButton.visible = false;

                // Play sound
                lsDing.play();

                this.input.keyboard?.removeListener("keydown", enterListener);

                this.removeInputField();

                // Function to show the next loading bar and schedule its hiding
                const showNextLoadingBar = () => {
                    // Show the current loading bar
                    loadingBars[currentBarIndex].visible = true;

                    // Increment the index for the next loading bar
                    currentBarIndex++;

                    // If all loading bars have been shown, return
                    if (currentBarIndex >= loadingBars.length) {
                        if (currentBarIndex >= loadingBars.length) {
                            accessGranted.visible = true;

                            loadingBars[8].visible = false;

                            this.time.delayedCall(2200, () => {
                                if (username === "admin") {
                                    this.sound.stopAll();
                                    this.scene.start("LevelSelect", {
                                        username: username,
                                    });
                                } else {
                                    this.scene.start("IntroScene", {
                                        username: username,
                                    });
                                }
                            });

                            return;
                        }
                    }

                    this.time.delayedCall(100, () => {
                        loadingBars[currentBarIndex - 1].visible = false;

                        showNextLoadingBar();
                    });
                };

                showNextLoadingBar();
            }
        };

        this.input.keyboard?.on("keydown", enterListener);

        this.events.on("shutdown", this.removeInputField, this);

        document.addEventListener("mousedown", (event) => {
            if (!this.inputField.contains(event.target as Node)) {
                this.inputField.blur();
            }
        });
        this.inputField.focus();
    }

    resetScene() {
        this.charDelay = 80;
        this.lineDelay = 120;
        this.startX = 470;
        this.startY = 257;
        this.lineIndex = 0;
        this.content = ["Authorization Required"];
    }
    removeInputField() {
        if (this.inputField.parentElement) {
            this.inputField.parentElement.removeChild(this.inputField);
        }
    }

    enterButtonHoverState() {
        this.clickButton.setStyle({ fill: "#333" });
        this.clickButton.setStyle({ backgroundColor: "yellow" });
    }

    enterButtonRestState() {
        this.clickButton.setStyle({ backgroundColor: "gold" });

        this.clickButton.setStyle({ fill: "#000" });
    }

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
                    fontFamily: "Monospace",
                }
            );
            // Start typing the line
            this.typeText(line);
        }
    }

    // Helper to animate text typing
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

    update() {}
}
