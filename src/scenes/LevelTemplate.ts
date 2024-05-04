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
    private lastPosition: number = -1;
    private lsFlag: boolean = true;
    private cdFlag: boolean = true;
    private rmFlag: boolean = true;
    private manFlag: boolean = false;
    private catFlag: boolean = false;
    private lsMap = new Map<string, string>();
    private cdMap = new Map<string, string[]>();
    private cdBack = new Map<string, string>();
    private manMap = new Map<string, string>();
    private rmMap = new Map<string, string[]>();
    private mvMap = new Map<string, string[]>();
    private catMap = new Map<string, string>();

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
        this.load.image("ClosedBook", "../assets/LevelUI/ClosedBook.png");
        this.load.image("HoveredBook", "../assets/LevelUI/HoveredBook.png");
        this.load.image("OpenBook", "../assets/LevelUI/OpenBook.png");
        this.load.image("alfredicon", "assets/LevelUI/AlfredIcon.png");
        this.load.image("pin", "assets/LevelUI/pin.png");
        this.load.image("prompt", "assets/LevelUI/PromptBox.png");
        this.load.image("bomb", "assets/LevelUI/bomb.png");
        // load audio elements
        this.load.audio("ding", ["assets/Audio/ding.mp3"]);
        this.load.audio("cdDing", ["assets/Audio/cdDing.mp3"]);
        this.load.audio("lsDing", ["assets/Audio/lsDing.mp3"]);
        this.load.audio("cdBackDing", ["assets/Audio/cdBackDing.mp3"]);
        this.load.audio("manDing", ["assets/Audio/manDing.mp3"]);
    }
    setLsFlag(flag: boolean) {
        this.lsFlag = flag;
    }
    setCdFlag(flag: boolean) {
        this.cdFlag = flag;
    }
    setRmFlag(flag: boolean) {
        this.rmFlag = flag;
    }
    setManFlag(flag: boolean) {
        this.manFlag = flag;
    }
    setCatFlag(flag: boolean) {
        this.catFlag = flag;
    }
    setLsMap(map: Map<string, string>) {
        this.lsMap = map;
    }
    setCdMap(map: Map<string, string[]>) {
        this.cdMap = map;
    }
    setCdBack(map: Map<string, string>) {
        this.cdBack = map;
    }
    setManMap(map: Map<string, string>) {
        this.manMap = map;
    }
    setRmMap(map: Map<string, string[]>) {
        this.rmMap = map;
    }
    setMvMap(map: Map<string, string[]>) {
        this.mvMap = map;
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

    handleCommand(event: KeyboardEvent) {
        let ding = this.sound.add("ding", { loop: false });
        let lsDing = this.sound.add("lsDing", { loop: false });
        let cdDing = this.sound.add("cdDing", { loop: false });
        let cdBackDing = this.sound.add("cdBackDing", { loop: false });
        let manDing = this.sound.add("manDing", { loop: false });

        let state: string = "home";

        if (event.key === "Enter") {
            this.lastPosition = -1;
            const newText = this.inputField.value;
            if (newText.trim() !== "") {
                if (newText.trim() == "ls") {
                    lsDing.play();
                    this.inputField.value = ""; // Empty the input field
                    this.addTextToContainer(
                        this.username.toLowerCase().replace(/\s+/g, "_") +
                            ": " +
                            newText
                    );
                    this.addLsToContainer(this.lsMap.get(state) as string);
                } else if (newText.substring(0, 4) == "cat ") {
                    let catInput: string = newText.substring(4);
                    const catState = this.catMap.get(catInput);
                    if (catState !== undefined) {
                        lsDing.play();
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                        this.addTextToContainer(catState);
                    } else {
                        ding.play();
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                        this.addTextToContainer(
                            "File '" + catInput + "' not found"
                        );
                    }
                } else if (newText.substring(0, 3) == "cd ") {
                    let cdInput: string = newText.substring(3, newText.length);
                    // CD .. FUNCTIONALITY BELOW
                    const backState = this.cdBack.get(state);
                    const cdState = this.cdMap.get(state);
                    if (backState !== undefined && cdInput == "..") {
                        cdBackDing.play();

                        state = backState;
                        this.stateText.setText(state);
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                    }
                    // CD FUNCTIONALITY BELOW
                    else if (
                        cdState !== undefined &&
                        this.cdMap.get(state)?.includes(cdInput)
                    ) {
                        cdDing.play();

                        state = newText.substring(3);
                        this.stateText.setText(state);
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                    }
                    // CD DIRECTORY NOT FOUND BELOW
                    else {
                        ding.play();

                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                        this.addTextToContainer("Directory not found");
                    }
                    // MAN INPUT BELOW
                } else if (newText.substring(0, 4) == "man ") {
                    let manInput: string = newText.substring(4);

                    const manState = this.manMap.get(manInput);
                    if (manState !== undefined) {
                        manDing.play();
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                        this.addTextToContainer(
                            this.manMap.get(manInput) as string
                        );
                    } else {
                        ding.play();

                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer("agent09: " + newText);
                        this.addTextToContainer(
                            "Command '" + manInput + "' not found"
                        );
                    }
                }
                // NONSENSE INPUT BELOW
                else {
                    ding.play();
                    this.inputField.value = ""; // Empty the input field
                    this.addTextToContainer("agent09: " + newText);
                    this.addTextToContainer(
                        "Command '" + newText + "' not found"
                    );
                }
            }
        }
        if (event.key === "ArrowUp") {
            let index = this.lastText.length + this.lastPosition;
            if (index > 0) {
                this.inputField.value = this.lastText[index];
                this.lastPosition -= 1;
            }
        }
        if (event.key === "ArrowDown") {
            let index = this.lastText.length + this.lastPosition;
            if (index < this.lastText.length - 2) {
                this.inputField.value = this.lastText[index + 2];
                this.lastPosition += 1;
            }
        }
    }

    addLsToContainer(text: string) {
        const words = text.split(" ");

        const numNewlines = words.length;

        this.inputContainer.y -= numNewlines * 24.7;

        for (let word of words) {
            if (word.substring(0, 5) === "file_") {
                let newWord = word.substring(5);
                const newText = this.add.text(0, 0, newWord, {
                    fontSize: "24px",
                    color: "#77C3EC",
                });
                this.inputContainer.add(newText);
            } else if (word.substring(0, 4) === "dir_") {
                let newWord = word.substring(4);
                const newText = this.add.text(0, 0, newWord, {
                    fontSize: "24px",
                    color: "#86DC3D",
                });
                this.inputContainer.add(newText);
            } else {
                const newText = this.add.text(0, 0, word, {
                    fontSize: "24px",
                    color: "#fff",
                });
                this.inputContainer.add(newText);
            }

            this.repositionTextObjects();
        }
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

        this.addTextToContainer("Alfred: Welcome back " + this.username + "!");

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
        this.input.keyboard?.removeCapture(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.input.keyboard?.on("keydown", this.handleCommand, this);

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
