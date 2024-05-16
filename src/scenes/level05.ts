import Phaser from "phaser";
import Manual from "../objects/manual";

export default class Level5Scene extends Phaser.Scene {
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
    private typing: boolean = true;
    private objectiveCompleted: boolean = false;
    private lastText: string[] = [""];
    private manual: Manual;
    private lastPosition: number = -1;
    private menuMusic: Phaser.Sound.BaseSound | undefined;
    private hacked: boolean = false;

    constructor() {
        super({ key: "Level05" });
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
        this.load.image("ClosedBook", "../assets/LevelUI/ClosedBook.png");
        this.load.image("HoveredBook", "../assets/LevelUI/HoveredBook.png");
        this.load.image("OpenBook", "../assets/LevelUI/OpenBook.png");
    }

    create() {
        this.objectiveCompleted = false;
        this.add.rectangle(640, 360, 1280, 720, 0x000);

        this.add.image(220, 100, "spyicon").setDisplaySize(130, 130);
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

        let state: string = "chamber";

        const lsMap = new Map<string, string>();
        const cdMap = new Map<string, string[]>();
        const catMap = new Map<string, string>();
        const cdBack = new Map<string, string>();
        const manMap = new Map<string, string>();

        lsMap.set(
            "chamber",
            "dir_computer dir_storage_closet file_open_door.out file_sticky_note.txt dir_hallway"
        );
        lsMap.set("storage_closet", "empty");
        lsMap.set("computer", "empty");
        lsMap.set("hallway", "empty");

        cdMap.set("chamber", ["computer", "storage_closet", "hallway"]);
        cdMap.set("computer", []);
        cdMap.set("storage_closet", []);
        cdMap.set("hallway", []);

        catMap.set("papers", "What is Yortsed Corp?");
        catMap.set("sticky_note", "Who is namuh?");
        catMap.set("open_doors.out", "Cannot view executable files.");

        cdBack.set("computer", "chamber");
        cdBack.set("storage_closet", "chamber");
        cdBack.set("hallway", "chamber");
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

        this.appendToScroller("Welcome back " + this.username + "!");

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
            "Move the open_door file to the computer. Then execute the file and exit the chamber to the hallway.";
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
                const command = this.inputField.value.trim();
                this.lastText.push(command.trim());
                this.inputField.value = ""; // Clear the input field
                this.appendToScroller(
                    this.username.toLowerCase().replace(/\s+/g, "_") +
                        ": " +
                        command
                );
                if (command.substring(0, 2) === "./") {
                    if (
                        command.substring(2) === "open_door.out" &&
                        state === "computer" &&
                        lsMap.get("computer")?.includes("file_open_door.out")
                    ) {
                        cdDing.play();
                        this.hacked = true;
                        this.appendToScroller("Door opened successfully!");
                        this.appendToScroller(
                            "Now go back to the chamber, then exit to the hallway"
                        );
                    } else {
                        if (command.substring(2) === "open_door.out") {
                            this.appendToScroller(
                                "Not in the correct directory or executable not moved"
                            );
                        } else {
                            this.appendToScroller(
                                "File " +
                                    "'" +
                                    command.substring(2) +
                                    "'" +
                                    " cannot be executed."
                            );
                        }
                    }
                } else if (command === "ls") {
                    lsDing.play();

                    this.appendLsToScroller(lsMap.get(state) as string);
                } else if (command.substring(0, 3) == "rm ") {
                    this.appendToScroller("Command unavailable for level 5");
                } else if (command.substring(0, 3) == "mv ") {
                    const file = command.substring(3);
                    const fileArr: string[] = file.split(" ");
                    if (
                        state === "chamber" &&
                        fileArr[0] === "open_door.out" &&
                        fileArr[1] === "computer"
                    ) {
                        cdDing.play();
                        lsMap.set(
                            "chamber",
                            lsMap
                                .get("chamber")
                                ?.replace("open_door.out", "") ?? ""
                        );
                        lsMap.set(
                            "computer",
                            lsMap
                                .get("computer")
                                ?.replace("empty", "file_open_door.out") ?? ""
                        );
                        this.appendToScroller(
                            "open_door.out moved successfully!"
                        );
                        this.appendToScroller(
                            "Now enter the computer to execute the file."
                        );
                    } else if (
                        state === "chamber" &&
                        fileArr[0] !== "open_door.out" &&
                        fileArr[1] === "computer"
                    ) {
                        this.appendToScroller(
                            "File " +
                                "'" +
                                fileArr[0] +
                                "'" +
                                " not found or incorrect"
                        );
                    } else if (
                        state === "chamber" &&
                        fileArr[0] === "open_door.out" &&
                        fileArr[1] !== "computer"
                    ) {
                        this.appendToScroller(
                            "Directory " +
                                "'" +
                                fileArr[1] +
                                "'" +
                                " not found or incorrect"
                        );
                    } else {
                        this.appendToScroller("Invalid or incorrect command");
                    }
                } else if (
                    command.substring(0, 3) == "cd " &&
                    command.substring(0, 5) !== "cd .."
                ) {
                    const dir = command.substring(3);
                    const dirC = cdMap.get(dir);
                    if (
                        !this.hacked &&
                        state === "chamber" &&
                        dir === "hallway"
                    ) {
                        this.appendToScroller(
                            "You must hack the computer first."
                        );
                    } else if (
                        this.hacked &&
                        state === "chamber" &&
                        dir === "hallway"
                    ) {
                        this.appendToScroller("Escape Successful");
                        this.appendToScroller("Objective Complete");
                        winChime.play();
                        this.objectiveCompleted = true;
                        this.time.delayedCall(3000, this.loadLevel, [], this);
                    }
                    if (dirC !== undefined) {
                        cdDing.play();
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
                    if (state !== "back_door" && dir) {
                        cdBackDing.play();
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

                        this.appendToScroller(tip);
                    } else {
                        ding.play();
                        this.appendToScroller(
                            "Command " + manual + " not found."
                        );
                    }
                } else {
                    ding.play();
                    this.appendToScroller(
                        this.username.toLowerCase().replace(/\s+/g, "_") +
                            ": " +
                            command
                    );
                    this.appendToScroller("Command " + command + " not found.");
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
        let lastUpdateTime = Date.now();

        // Create the timer text
        let timerText = this.add.text(109, 589, time.toFixed(2), {
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
                    timerText.setText(time.toFixed(2)); // Update the timer text
                    this.time.delayedCall(10, updateTimer);
                } else {
                    timerText.setText("0.00");
                    this.scroller.style.display = "none";
                    this.textContainer.style.display = "none";
                    this.textElement.style.display = "none";
                    this.sound.stopAll();

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

        this.events.on("shutdown", () => {});

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
        if (text.includes("Welcome back") || text.includes("Now")) {
            textNode.style.color = "gold";
        } else if (
            text.includes("Access Granted") ||
            text.includes("Objective Complete") ||
            text.includes("successfully") ||
            text.includes("Successful")
        ) {
            textNode.style.color = "#86DC3D";
        } else if (
            text.includes("cannot be removed or found.") ||
            text.includes("not found") ||
            text.includes("Cannot") ||
            text.includes("Wrong") ||
            text.includes("must") ||
            text.includes("cannot")
        ) {
            textNode.style.color = "#d0413f";
        } else {
            textNode.style.color = "white";
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
        if (text === "empty") {
            this.appendToScroller("Directory is empty.");
            return;
        }
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
                addNode.style.paddingLeft = "15px";

                addNode.style.color = "#86DC3D";
                addNode.style.fontFamily = "Monospace";
                addNode.style.fontSize = "24px";
                this.scroller.appendChild(addNode);
            } else if (word.substring(0, 5) === "file_") {
                total += word.length + spaceLength;
                const addNode = document.createElement("text");
                addNode.textContent = word.substring(5) + spaces;
                addNode.style.paddingLeft = "15px";

                addNode.style.color = "#77C3EC";
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
        this.textContainer.style.display = "none";
        this.textElement.style.display = "none";
        this.scroller.style.display = "none";
        this.scene.start("LevelSelect", {
            username: this.username,
            lvl2: true,
            lvl3: this.lvl3,
            lvl4: this.lvl4,
            lvl5: this.lvl5,
        });
    }
}
