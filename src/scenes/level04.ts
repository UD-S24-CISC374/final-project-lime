import Phaser from "phaser";
import Manual from "../objects/manual";

export default class Level4Scene extends Phaser.Scene {
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
    private trapComplete: boolean = false;
    private bombComplete: boolean = false;
    private objectiveCompleted: boolean = false;
    private lastText: string[] = [""];
    private lastPosition: number = -1;
    private manual: Manual;
    private menuMusic: Phaser.Sound.BaseSound | undefined;
    private endTime: number;
    private time1: number;
    private time2: number;
    private time3: number;
    private time4: number;
    private time5: number;
    private bestTime: number;

    constructor() {
        super({ key: "Level04" });
    }

    init(data: {
        username: string;

        lvl1: boolean;

        lvl2: boolean;

        lvl3: boolean;

        lvl4: boolean;

        lvl5: boolean;

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
        this.lvl5 = data.lvl5;
        this.time1 = data.time1;
        this.time2 = data.time2;
        this.time3 = data.time3;
        this.time4 = data.time4;
        this.time5 = data.time5;
        this.bestTime = data.time4;
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

        let state: string = "facility";

        const lsMap = new Map<string, string>();
        const cdMap = new Map<string, string[]>();
        const catMap = new Map<string, string>();

        const cdBack = new Map<string, string>();
        const manMap = new Map<string, string>();

        lsMap.set(
            "facility",
            "dir_office dir_hallway dir_storage_room file_alfred_note.txt"
        );
        lsMap.set("office", "");
        lsMap.set("storage_room", "");
        lsMap.set("hallway", "dir_chamber");
        lsMap.set("chamber", "");

        cdMap.set("facility", ["office", "hallway", "storage_room"]);
        cdMap.set("office", []);
        cdMap.set("storage_room", []);
        cdMap.set("hallway", ["chamber"]);
        cdMap.set("chamber", []);

        cdBack.set("office", "facility");
        cdBack.set("storage_room", "facility");
        cdBack.set("hallway", "facility");
        cdBack.set("chamber", "hallway");

        catMap.set("alfred_note.txt", "Read 'Namuh Yortsed' backwards..");

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
        this.scroller.style.width = "44vw";
        this.scroller.style.height = "46vh"; // Set height relative to width
        // this.scroller.style.maxWidth = "600px"; // Set maximum width
        this.scroller.style.maxHeight = "29vw";
        this.scroller.style.backgroundColor = "black";
        this.scroller.style.color = "white";
        this.scroller.style.borderRadius = "10px";
        this.scroller.style.overflowY = "auto"; // Enable vertical scrolling
        this.scroller.style.position = "absolute";
        this.scroller.style.border = "solid 2px gray";
        this.scroller.style.padding = "5px ";
        this.scroller.style.background =
            "linear-gradient(-200deg, #444444, #000000)";
        this.scroller.style.top = "48%";
        this.scroller.style.left = "50%";
        this.scroller.style.bottom = "49%";
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
            "Create a file named 'trap' in the 'office' directory. Create a file named 'bomb' in the 'chamber' directory.";
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
                } else if (command.substring(0, 4) == "cat ") {
                    const file = command.substring(4);
                    const fileContents = catMap.get(file);
                    if (fileContents !== undefined) {
                        lsDing.play();
                        this.appendToScroller(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                command
                        );
                        this.appendToScroller(fileContents as string);
                    } else {
                        ding.play();
                        this.appendToScroller("File " + file + " not found.");
                    }
                } else if (
                    command.substring(0, 3) == "cd " &&
                    command.substring(0, 5) !== "cd .."
                ) {
                    const dir = command.substring(3);
                    const dirC = cdMap.get(dir);

                    if (dirC !== undefined) {
                        cdDing.play();
                        this.appendToScroller(this.username + ": " + command);
                        state = command.substring(3);
                        this.stateText.setText(state);
                    } else {
                        ding.play();
                        this.appendToScroller(
                            "Directory " + dir + " not found."
                        );
                    }
                } else if (command.substring(0, 5) == "cd ..") {
                    const dir = cdBack.get(state);
                    if (state !== "facility" && dir) {
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
                } else if (command.substring(0, 6) == "touch ") {
                    const file = command.substring(6);
                    const fileArr: string[] = file.split(" ");

                    let touchFile = fileArr[0];
                    let touchDir;
                    if (fileArr.length > 1) {
                        touchDir = fileArr[1];
                    } else {
                        touchDir = state;
                    }

                    this.appendToScroller(this.username + ": " + command);

                    if (
                        fileArr.length > 2 ||
                        (fileArr.length == 2 &&
                            !cdMap.get(state)?.includes(touchDir))
                    ) {
                        ding.play();
                        this.appendToScroller("Invalid directory.");
                    } else {
                        const existingValue = lsMap.get(touchDir);
                        const updatedValue =
                            (existingValue ? existingValue + " " : "") +
                            "file_" +
                            touchFile;

                        lsMap.set(touchDir, updatedValue.trim());

                        lsDing.play();
                        if (touchFile == "trap" && touchDir == "office") {
                            this.trapComplete = true;
                            this.appendToScroller(
                                "Trap placed in office successfully."
                            );
                        }
                        if (touchFile == "bomb" && touchDir == "chamber") {
                            this.bombComplete = true;
                            this.appendToScroller(
                                "Bomb placed in chamber successfully."
                            );
                        }
                        if (this.bombComplete && this.trapComplete) {
                            this.time.delayedCall(
                                1000,
                                () => {
                                    winChime.play();
                                    this.appendToScroller(
                                        "Objective Complete: Trap and bomb placed."
                                    );
                                    this.objectiveCompleted = true;

                                    this.time.delayedCall(2000, () => {
                                        this.loadLevel();
                                    });
                                },
                                [],
                                this
                            );
                        }
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
            if (
                event.key === "ArrowLeft" &&
                this.inputField.selectionStart !== null
            ) {
                if (this.inputField.selectionStart > 0) {
                    this.inputField.selectionStart -= 1;
                    this.inputField.selectionEnd =
                        this.inputField.selectionStart;
                }
            } else if (
                event.key === "ArrowRight" &&
                this.inputField.selectionEnd !== null
            ) {
                if (
                    this.inputField.selectionEnd <
                        this.inputField.value.length &&
                    this.inputField.selectionStart !== null
                ) {
                    this.inputField.selectionStart += 1;
                    this.inputField.selectionEnd =
                        this.inputField.selectionStart;
                }
            }
        });

        let time = 60;
        this.time4 = 60;
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
                this.endTime = time;

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
                        time1: this.time1,
                        time2: this.time2,
                        time3: this.time3,
                        time4: this.time4,
                        time5: this.time5,
                    });
                }
            }
        };

        updateTimer();

        this.stateText = this.add.text(1075, 95, "pwd: " + state, {
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

        document.addEventListener("mousedown", (event) => {
            if (!this.inputField.contains(event.target as Node)) {
                this.inputField.blur();
            }
        });
        this.inputField.focus();
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
        if (text.includes("Alfred: ") || text.includes("successfully")) {
            textNode.style.color = "gold";
        } else if (text.includes("Access Granted")) {
            textNode.style.color = "#86DC3D";
        } else if (text.includes("Objective Complete")) {
            textNode.style.color = "#86DC3D";
        } else if (
            text.includes("Cannot") ||
            text.includes("Access Denied") ||
            text.includes("Invalid Directory") ||
            text.includes("Command not found") ||
            text.includes("not found")
        ) {
            textNode.style.color = "#d0413f";
        }
        textNode.style.fontFamily = "Monospace";
        textNode.style.fontSize = "24px";
        textNode.style.marginBottom = "-15px";
        textNode.style.paddingLeft = "15px";

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
                addNode.style.paddingLeft = "15px";

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
                addNode.style.paddingLeft = "15px";

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
        console.log("Time4: " + this.time4);
        console.log("Best Time: " + this.bestTime);
        console.log("Objective Completed: " + this.objectiveCompleted);
        console.log("End Time: " + this.endTime);
        if (this.objectiveCompleted) {
            let finalTime = this.time4 - this.endTime;
            if (!this.bestTime || finalTime < this.bestTime) {
                this.time4 = finalTime;
            } else {
                this.time4 = this.bestTime;
            }
        } else {
            this.time4 = this.bestTime;
        }
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
            time1: this.time1,
            time2: this.time2,
            time3: this.time3,
            time4: this.time4,
            time5: this.time5,
        });
    }
}
