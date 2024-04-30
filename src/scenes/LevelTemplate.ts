import Phaser from "phaser";
import Manual from "../objects/manual";

export default class LevelTemplate extends Phaser.Scene {
    private manual: Manual;
    private username: string;
    private inputContainer: Phaser.GameObjects.Container;
    private inputField: HTMLInputElement;
    private stateText: Phaser.GameObjects.Text;
    private objectiveCompleted: boolean = false;
    private lastText: string[] = [""];
    private lvl1: boolean;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private lvl5: boolean;
    private manualText: string;
    private promptText: string;
    private timer: Phaser.GameObjects.Text;
    // private commands: Command[];
    private timeLimit: number;

    constructor(levelKey: string) {
        super({ key: levelKey });
    }
    init(data: {
        username: string;

        lvl1: boolean;

        lvl2: boolean;

        lvl3: boolean;

        lvl4: boolean;

        lvl5: boolean;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.username = data.username;
        this.lvl5 = data.lvl5;
    }
    preload() {
        // load images
        this.load.image("ClosedBook", "../assets/ClosedBook.png");
        this.load.image("HoveredBook", "../assets/HoveredBook.png");
        this.load.image("OpenBook", "../assets/OpenBook.png");
        this.load.image("alfredicon", "assets/AlfredIcon.png");
        this.load.image("pin", "assets/pin.png");
        this.load.image("prompt", "assets/PromptBox.png");
        this.load.image("bomb", "assets/bomb.png");
        // load audio elements
        this.load.audio("ding", ["assets/ding.mp3"]);
        this.load.audio("cdDing", ["assets/cdDing.mp3"]);
        this.load.audio("lsDing", ["assets/lsDing.mp3"]);
        this.load.audio("cdBackDing", ["assets/cdBackDing.mp3"]);
        this.load.audio("manDing", ["assets/manDing.mp3"]);
    }
    setLastText(text: string) {
        this.lastText.push(text);
    }
    setManualText(text: string) {
        this.manualText = text;
    }
    setPromptText(text: string) {
        this.promptText = text;
    }

    addTextToContainer(text: string) {
        const newText = this.add.text(0, 0, text, {
            fontSize: "24px",
            color: "#fff",
        });

        const numNewlines = (text.match(/\n/g) || []).length + 1;

        // Adjust y position based on the number of newline characters
        this.inputContainer.y -= numNewlines * 24.7;

        if (text.includes("Alfred: ")) {
            newText.setColor("gold");
        }
        if (text.includes("Objective complete: ")) {
            newText.setColor("lime");
        }

        // Add the new text object to the container
        this.inputContainer.add(newText);

        // Reposition text objects vertically within the container
        this.repositionTextObjects();
    }

    repositionTextObjects() {
        let yPos = 0;

        // Loop through all text objects in the container and position them vertically
        this.inputContainer.iterate((child: Phaser.GameObjects.GameObject) => {
            if (child instanceof Phaser.GameObjects.Text) {
                child.y = yPos;
                yPos += child.height;
            }
        });
    }
    setTimeLimit(time: number) {
        this.timeLimit = time;
    }

    create() {
        // Set the Objective Flag to False
        this.objectiveCompleted = false;
        // Set Basic UI
        this.add.rectangle(640, 360, 1280, 720, 0x000);
        this.add.image(640, 100, "prompt").setDisplaySize(560, 110);
        this.add.image(220, 100, "alfredicon").setDisplaySize(130, 130);
        this.add.image(1050, 100, "pin").setDisplaySize(30, 40);
        this.add.image(150, 570, "bomb").setDisplaySize(150, 200);
        this.manual = new Manual(this, 50, 100, this.manualText);
        this.inputContainer = this.add.container(360, 520);

        const maskGraphics = this.make.graphics();
        maskGraphics.fillRect(300, 185, 1080, 500);
        const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);

        this.inputContainer.setMask(mask);

        // Add text input field
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.position = "absolute";
        this.inputField.style.width = "600px";
        this.inputField.style.height = "40px";
        this.inputField.style.fontSize = "20px";
        this.inputField.style.top = "80%";
        this.inputField.style.left = "50%";
        this.inputField.style.backgroundColor = "#000"; // Change background color to white
        this.inputField.style.color = "#fff"; // Change text color to black
        this.inputField.placeholder = ">$"; // Placeholder text
        this.inputField.style.border = "2px solid gold";

        this.inputField.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.inputField);

        this.add.text(410, 59, this.promptText, {
            color: "#fff",
            fontSize: "22px",
            fontFamily: "Monospace",
        });

        let lastUpdateTime = Date.now();

        this.timer = this.add.text(109, 589, this.timeLimit.toFixed(2), {
            fontSize: "30px",
            color: "red",
        });

        const updateTimer = () => {
            if (!this.objectiveCompleted) {
                const currentTime = Date.now();
                const elapsedTime = currentTime - lastUpdateTime;

                this.timeLimit -= elapsedTime / 1000; // Adjust time based on elapsed time in seconds
                lastUpdateTime = currentTime; // Update the last update time

                if (this.timeLimit > 0) {
                    this.timer.setText(this.timeLimit.toFixed(2)); // Update the timer text
                    this.time.delayedCall(10, updateTimer);
                } else {
                    this.timer.setText("0.00");
                    this.scene.start("SecurityBreachScene", {
                        username: this.username,
                        lvl2: this.lvl2,
                        lvl3: this.lvl3,
                        lvl4: this.lvl4,
                    });
                }
            }
        };

        updateTimer();
    }
}
