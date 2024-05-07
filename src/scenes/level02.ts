import Phaser from "phaser";
import Manual from "../objects/manual";

export default class Level2Scene extends Phaser.Scene {
    private stateText: Phaser.GameObjects.Text;
    private inputField: HTMLInputElement;
    private scroller: HTMLDivElement;
    private textContainer: HTMLDivElement;
    private textElement: HTMLDivElement;
    private timer: Phaser.GameObjects.Text;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private username: string;
    private lvl5: boolean;
    private gen1Complete: boolean = false;
    private gen2Complete: boolean = false;
    private objectiveCompleted: boolean = false;
    private lastText: string[] = [""];
    private lastPosition: number = -1;
    private manual: Manual;
    private menuMusic: Phaser.Sound.BaseSound | undefined;

    constructor() {
        super({ key: "Level02" });
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
    preload() {}

    create() {
        this.objectiveCompleted = false;
        this.add.rectangle(640, 360, 1280, 720, 0x000);

        this.add.image(220, 100, "alfredicon").setDisplaySize(130, 130);
        this.add.image(1050, 100, "pin").setDisplaySize(30, 40);
        this.add.image(150, 570, "bomb").setDisplaySize(150, 200);
        this.manual = new Manual(
            this,
            50,
            100,
            "        COMMAND MANUAL \n\n- 'ls' to list the contents      of the current directory.\n\n- 'cd <directory>' to change     the current directory.\n\n- 'man <command>' to display     the manual for a specific     command.\n\n- 'rm <file> to remove a         file from its directory."
        );

        let ding = this.sound.add("ding", { loop: false });
        let lsDing = this.sound.add("lsDing", { loop: false });
        let cdDing = this.sound.add("cdDing", { loop: false });
        let cdBackDing = this.sound.add("cdBackDing", { loop: false });
        let manDing = this.sound.add("manDing", { loop: false });
        let winChime = this.sound.add("winChime", { loop: false });

        let state: string = "home";

        const lsMap = new Map<string, string>();
        const cdMap = new Map<string, string[]>();
        const cdBack = new Map<string, string>();
        const manMap = new Map<string, string>();
        const mvMap = new Map<string, string[]>();

        lsMap.set(
            "home",
            "dir_generator1 dir_generator2 dir_laboratory file_emp_bomb1 file_emp_bomb2"
        );
        lsMap.set("generator1", "file_empty");
        lsMap.set("generator2", "file_empty");

        cdMap.set("home", ["generator1", "generator2", "laboratory"]);
        cdMap.set("generator1", []);
        cdMap.set("generator2", []);

        cdBack.set("generator1", "home");
        cdBack.set("generator2", "home");

        mvMap.set("home", ["emp_bomb1", "emp_bomb2"]);
        mvMap.set("generator1", ["emp_bomb1"]);
        mvMap.set("generator2", ["emp_bomb2"]);

        manMap.set(
            "ls",
            "Alfred: Remember, the 'ls' command\nis useful for viewing your surroundings."
        );
        manMap.set(
            "mv",
            "Alfred: Remember, the 'mv' command\nis used to move a file into a new directory."
        );
        manMap.set(
            "rm",
            "Alfred: Remember, the 'rm' command\nneutralizes enemy files."
        );
        manMap.set(
            "cd",
            "Alfred: Do recall, the 'cd' command\npermits you to navigate through rooms and items."
        );
        manMap.set(
            "alfred",
            "Alfred: Try using the 'cd' command to traverse through\ndifferent areas. Then use 'rm' to remove critical files."
        );

        // Add scrollable text area
        this.scroller = document.createElement("div");
        this.scroller.style.width = "600px";
        this.scroller.style.height = "390px";
        this.scroller.style.backgroundColor = "black";
        this.scroller.style.color = "white";
        // this.scroller.style.borderRadius = "10px";
        this.scroller.style.overflowY = "auto"; // Enable vertical scrolling
        this.scroller.style.position = "absolute";
        this.scroller.style.top = "51%";
        this.scroller.style.left = "50%";
        this.scroller.style.bottom = "49%";
        this.scroller.style.paddingInline = "2px";
        this.scroller.style.paddingBlock = "2px";
        this.scroller.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.scroller);

        const whiteSpace = document.createElement("p");
        whiteSpace.textContent = "                                        ";
        whiteSpace.style.marginTop = "350px";
        this.scroller.appendChild(whiteSpace);

        this.appendToScroller("Alfred: Welcome back " + this.username + "!");

        // Add text input field
        // Add text input field
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.position = "absolute";
        this.inputField.style.width = "44vw";
        this.inputField.style.height = "80px";
        this.inputField.style.fontSize = "20px";
        this.inputField.style.top = "80%";
        this.inputField.style.left = "50%";
        this.inputField.style.backgroundColor = "#000"; // Change background color to white
        this.inputField.style.color = "#fff"; // Change text color to black
        this.inputField.placeholder = ">$"; // Placeholder text
        this.inputField.style.border = "2px solid white";

        this.inputField.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.inputField);

        this.textContainer = document.createElement("div");
        this.textContainer.style.position = "absolute";
        this.textContainer.style.width = "44vw";
        this.textContainer.style.height = "auto";
        this.textContainer.style.bottom = "73%";
        this.textContainer.style.left = "50%";
        this.textContainer.style.transform = "translate(-50%, -50%)";
        this.textContainer.style.background =
            "linear-gradient(-200deg, #444444, #000000)"; // Background color
        this.textContainer.style.padding = "10px"; // Padding for the text
        this.textContainer.style.border = "2px solid gray"; // Border style

        // Create the text element
        this.textElement = document.createElement("div");
        this.textElement.textContent =
            "Move the 'emp_bomb' files into their\nrespective 'generator' directories. Try using the 'mv' command to change where they are stored.";
        this.textElement.style.color = "#fff"; // Text color
        this.textElement.style.fontSize = "20px"; // Font size
        this.textElement.style.fontFamily = "Monospace"; // Font family

        // Append the text to the container
        this.textContainer.appendChild(this.textElement);

        // Append the container to the document body
        document.body.appendChild(this.textContainer);

        this.input.keyboard?.removeCapture(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.lastPosition = -1;
                const command = this.inputField.value;
                this.lastText.push(command.trim());

                this.inputField.value = ""; // Clear the input field
                if (command === "ls") {
                    lsDing.play();
                    this.appendToScroller(this.username + ": " + command);
                    this.appendLsToScroller(lsMap.get(state) as string);
                } else if (
                    command.substring(0, 3) == "cd " &&
                    command.substring(0, 5) !== "cd .."
                ) {
                    if (
                        this.gen1Complete &&
                        this.gen2Complete &&
                        command.substring(3) === "laboratory"
                    ) {
                        this.objectiveCompleted = true;
                        winChime.play();
                        this.appendToScroller(this.username + ": " + command);
                        this.appendToScroller(
                            "Objective complete: Laboratory access granted. Good work, " +
                                this.username +
                                "!"
                        );
                        this.time.delayedCall(3000, this.loadLevel, [], this);
                    } else if (
                        !(this.gen1Complete && this.gen2Complete) &&
                        command.substring(3) === "laboratory"
                    ) {
                        ding.play();
                        this.appendToScroller(
                            "Alfred: Move the emp_bomb files to their respective generators to enter."
                        );
                    } else {
                        const dir = command.substring(3);
                        const dirC = cdMap.get(dir);

                        if (dirC !== undefined) {
                            cdDing.play();
                            this.appendToScroller(
                                this.username + ": " + command
                            );
                            state = command.substring(3);
                            this.stateText.setText(state);
                        } else {
                            ding.play();
                            this.appendToScroller(
                                "Directory " + dir + " not found."
                            );
                        }
                    }
                } else if (command.substring(0, 5) == "cd ..") {
                    const dir = cdBack.get(state);
                    if (state !== "back_door" && dir) {
                        cdBackDing.play();
                        this.appendToScroller(this.username + ": " + command);
                        this.stateText.setText(dir);
                        state = dir;
                    } else {
                        ding.play();
                        this.appendToScroller(
                            "Cannot go back from the root directory."
                        );
                    }
                } else if (command.substring(0, 4) == "man ") {
                    const manual = command.substring(4);
                    const tip = manMap.get(manual);
                    if (tip !== undefined) {
                        manDing.play();
                        this.appendToScroller(this.username + ": " + command);
                        this.appendToScroller(tip);
                    } else {
                        ding.play();
                        this.appendToScroller(
                            "Command " + manual + " not found."
                        );
                    }
                } else if (command.substring(0, 3) == "mv ") {
                    const file = command.substring(3);
                    const fileArr: string[] = file.split(" ");
                    if (
                        fileArr[0] === "emp_bomb1" &&
                        fileArr[1] === "generator1"
                    ) {
                        lsMap.set(
                            "home",
                            lsMap
                                .get("home")
                                ?.replace("emp_bomb1", "")
                                .trim() || ""
                        ); // Remove emp_bomb1 from lsMap
                        this.appendToScroller(this.username + ": " + command);
                        lsMap.set(
                            "generator1",
                            lsMap
                                .get("generator1")
                                ?.replace("empty", "emp_bomb1")
                                .trim() || ""
                        ); // Add emp_bomb1 to generator1
                        lsDing.play();
                        this.gen1Complete = true;
                        this.appendToScroller("emp_bomb1 moved successfully.");
                        if (this.gen2Complete) {
                            this.time.delayedCall(
                                1000,
                                () => {
                                    this.appendToScroller(
                                        "Alfred: Great, both generators have been shut down. Now enter to the laboratory to finish this mission."
                                    );
                                },
                                [],
                                this
                            );
                        }
                    } else if (
                        fileArr[0] === "emp_bomb2" &&
                        fileArr[1] === "generator2"
                    ) {
                        lsMap.set(
                            "home",
                            lsMap
                                .get("home")
                                ?.replace("emp_bomb2", "")
                                .trim() || ""
                        ); // Remove emp_bomb1 from lsMap
                        lsMap.set(
                            "generator2",
                            lsMap
                                .get("generator2")
                                ?.replace("empty", "emp_bomb2")
                                .trim() || ""
                        ); // Add emp_bomb2 to generator2
                        lsDing.play();
                        this.gen2Complete = true;
                        this.appendToScroller(this.username + ": " + command);
                        this.appendToScroller("emp_bomb2 moved successfully.");
                        if (this.gen1Complete) {
                            this.time.delayedCall(
                                1000,
                                () => {
                                    this.appendToScroller(
                                        "Alfred: Great, Both generators have been shut down. Now enter to the laboratory to finish this mission."
                                    );
                                },
                                [],
                                this
                            );
                        }
                    } else {
                        ding.play();
                        this.appendToScroller("Cannot move or invalid file.");
                    }
                } else {
                    ding.play();
                    this.appendToScroller(this.username + ": " + command);
                    this.appendToScroller("Command not found.");
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
        });

        let time = 60;
        let lastUpdateTime = Date.now();

        this.timer = this.add.text(109, 589, time.toFixed(2), {
            fontSize: "30px",
            color: "red",
        });

        const updateTimer = () => {
            if (!this.objectiveCompleted) {
                const currentTime = Date.now();
                const elapsedTime = currentTime - lastUpdateTime;

                time -= elapsedTime / 1000; // Adjust time based on elapsed time in seconds
                lastUpdateTime = currentTime; // Update the last update time

                if (time > 0) {
                    this.timer.setText(time.toFixed(2)); // Update the timer text
                    this.time.delayedCall(10, updateTimer);
                } else {
                    this.timer.setText("0.00");
                    this.sound.stopAll();
                    this.scroller.style.display = "none";
                    this.textContainer.style.display = "none";
                    this.textElement.style.display = "none";

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

        this.stateText = this.add.text(1075, 95, state, {
            fontSize: "24px",
            color: "#fff",
        });
        this.events.on("shutdown", this.removeInputField, this);

        // Add back arrow
        const backArrow = this.add
            .image(50, 35, "backArrow")
            .setDisplaySize(30, 30);
        backArrow.setInteractive();
        backArrow.on("pointerup", () => {
            this.loadLevel();
        });
        backArrow.on("pointerover", () => {
            backArrow.setTint(0x44ff44);
        });
        backArrow.on("pointerout", () => {
            backArrow.clearTint();
        });
    }
    removeInputField() {
        if (this.inputField.parentElement) {
            this.inputField.parentElement.removeChild(this.inputField);
        }
    }
    update() {}

    appendToScroller(text: string) {
        const textNode = document.createElement("text");
        const spaceNode = document.createElement("p");
        let spaces: string = "";
        if (text.includes("Alfred: ")) {
            textNode.style.color = "gold";
        } else if (text.includes("Access Granted")) {
            textNode.style.color = "#86DC3D";
        } else if (
            text.includes("Objective complete") ||
            text.includes("successfully")
        ) {
            textNode.style.color = "#86DC3D";
        } else if (
            text.includes("Cannot") ||
            text.includes("Access Denied") ||
            text.includes("Command not found") ||
            text.includes("not found")
        ) {
            textNode.style.color = "#d0413f";
        }
        textNode.style.fontFamily = "Monospace";
        textNode.style.fontSize = "24px";
        textNode.style.marginBottom = "-15px";
        const desiredWidth = 41;

        const textLength = text.length;
        const spacesNeeded = desiredWidth - textLength;

        for (let i = 0; i < spacesNeeded; i++) {
            spaces += " ";
        }
        spaceNode.textContent = spaces;
        textNode.textContent = text;
        this.scroller.appendChild(textNode);
        this.scroller.appendChild(spaceNode);

        // Scroll to the bottom
        this.scroller.scrollTop = this.scroller.scrollHeight;
    }

    appendLsToScroller(text: string) {
        const desiredWidth = 41;
        const spaces = "                            ";
        const spaceLength = spaces.length;
        let total = 0;
        const words = text.split(" ");
        for (let word of words) {
            if (word.substring(0, 4) === "dir_") {
                total += word.length + spaceLength;
                const addNode = document.createElement("text");
                addNode.textContent = word.substring(4) + spaces;
                addNode.style.color = "#86DC3D";
                addNode.style.fontFamily = "Monospace";
                addNode.style.fontSize = "24px";
                this.scroller.appendChild(addNode);
            } else if (word.substring(0, 5) === "file_") {
                total += word.length + spaceLength;
                const addNode = document.createElement("text");
                addNode.textContent = word.substring(5) + spaces;
                if (word.substring(5) === "empty") {
                    addNode.style.color = "white";
                } else {
                    addNode.style.color = "#77C3EC";
                }
                addNode.style.fontFamily = "Monospace";
                addNode.style.fontSize = "24px";
                this.scroller.appendChild(addNode);
            }
        }
        let endSpace = "";
        const spaceNeeded = desiredWidth - total;
        for (let i = 0; i < spaceNeeded; i++) {
            endSpace += " ";
        }
        const endNode = document.createElement("p");
        endNode.textContent = endSpace;
        this.scroller.appendChild(endNode);
        this.scroller.scrollTop = this.scroller.scrollHeight;
    }

    loadLevel() {
        this.removeInputField();
        this.sound.stopAll();
        this.menuMusic = this.sound.add("menuMusic", {
            loop: true,
        });
        this.menuMusic.play();
        this.scroller.style.display = "none";
        this.textContainer.style.display = "none";
        this.textElement.style.display = "none";
        this.scene.start("LevelSelect", {
            username: this.username,
            lvl2: true,
            lvl3: true,
            lvl4: this.lvl4,
            lvl5: this.lvl5,
        });
    }
}
