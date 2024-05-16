import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
    private stateText: Phaser.GameObjects.Text;
    private inputField: HTMLInputElement;
    private inputContainer: Phaser.GameObjects.Container;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private username: string;
    private lvl5: boolean;
    private scroller: HTMLDivElement;
    private firstLsObjective: boolean = false;
    private secondLsObjective: boolean = false;
    private cdObjective: boolean = false;
    private cdBackObjective: boolean = false;
    private manObjective: boolean = false;
    private rmObjective: boolean = false;
    private lastText: string[] = [""];
    private lastPosition: number = -1;
    private time1: number;
    private time2: number;
    private time3: number;
    private time4: number;
    private time5: number;

    constructor() {
        super({ key: "Tutorial" });
    }
    resetScene() {
        this.firstLsObjective = false;
        this.secondLsObjective = false;
        this.cdObjective = false;
        this.cdBackObjective = false;
        this.manObjective = false;
        this.rmObjective = false;
        this.lastText = [""];
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
    }
    preload() {}

    create() {
        this.resetScene();
        this.add.rectangle(640, 360, 1280, 720, 0x000);

        // this.add.image(640, 100, "prompt").setDisplaySize(560, 110);
        this.add.image(155, 100, "alfredicon").setDisplaySize(130, 130);
        this.add.image(1050, 100, "pin").setDisplaySize(30, 40);

        let ding = this.sound.add("ding", { loop: false });
        let lsDing = this.sound.add("lsDing", { loop: false });
        let cdDing = this.sound.add("cdDing", { loop: false });
        let cdBackDing = this.sound.add("cdBackDing", { loop: false });
        let manDing = this.sound.add("manDing", { loop: false });
        let rmDing = this.sound.add("rmDing", { loop: false });
        let winChime = this.sound.add("winChime", { loop: false });

        let state: string = "home";

        const lsMap = new Map<string, string>();
        const cdMap = new Map<string, string[]>();
        const cdBack = new Map<string, string>();
        const manMap = new Map<string, string>();
        const rmMap = new Map<string, string[]>();

        lsMap.set("home", "dir_headquarters");
        lsMap.set("headquarters", "file_door_lock");

        cdMap.set("home", ["headquarters"]);

        cdBack.set("headquarters", "home");

        rmMap.set("headquarters", ["door_lock"]);

        manMap.set(
            "ls",
            "Alfred: The 'ls' command is usefulfor viewing your surroundings."
        );
        manMap.set("rm", "Alfred: The 'rm' command neutralizes enemy files.");
        manMap.set(
            "cd",
            "Alfred: The 'cd' command permits you to navigate through rooms and items."
        );
        manMap.set(
            "alfred",
            "Alfred: Try using the 'cd' command to traverse through different areas. Then use 'rm' to remove critical files."
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

        this.appendToScroller(
            "Alfred: Welcome back " +
                this.username +
                "!" +
                "It has been quite a while so let's make sure you are familiar with all the basic commands. Type 'ls' to display the surroundings of your current directory."
        );
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

        this.input.keyboard?.removeCapture(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                this.lastPosition = -1;
                const newText = this.inputField.value;
                this.lastText.push(newText.trim());
                if (newText.trim() !== "") {
                    if (newText.trim() == "ls") {
                        lsDing.play();
                        this.inputField.value = ""; // Empty the input field

                        this.appendToScroller(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );
                        this.appendLsToScroller(lsMap.get(state) as string);

                        if (
                            !this.cdObjective &&
                            this.firstLsObjective &&
                            !this.secondLsObjective
                        ) {
                            this.appendToScroller(
                                "Alfred: Try the 'cd headquarters' command first."
                            );
                        } else if (
                            this.firstLsObjective &&
                            !this.secondLsObjective
                        ) {
                            this.secondLsObjective = true;

                            this.time.delayedCall(1200, () => {
                                this.appendToScroller(
                                    "Alfred: There is a door_lock. Try removing it with 'rm door_lock'."
                                );
                            });
                        } else if (
                            !this.firstLsObjective &&
                            !this.secondLsObjective
                        ) {
                            this.time.delayedCall(1200, () => {
                                this.firstLsObjective = true;

                                this.appendToScroller(
                                    "Alfred: Good job, now you can see that Namuh's headquarters is nearby. Use the 'cd headquarters' command to enter the directory."
                                );

                                // this.appendToScroller("basic commands.");
                                // this.appendToScroller("basic commands.");
                                // this.appendToScroller("basic commands.");
                                // this.appendToScroller("basic commands.");
                            });
                        }
                    } else if (newText.substring(0, 3) == "cd ") {
                        let cdInput: string = newText.substring(
                            3,
                            newText.length
                        );
                        // CD .. FUNCTIONALITY BELOW
                        const backState = cdBack.get(state);
                        const cdState = cdMap.get(state);
                        if (backState !== undefined && cdInput == "..") {
                            this.inputField.value = ""; // Empty the input field
                            this.appendToScroller(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            if (!this.secondLsObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'ls' command again."
                                );
                            } else if (!this.rmObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'rm door_lock' command before leaving."
                                );
                            } else if (!this.cdBackObjective) {
                                cdBackDing.play();

                                this.cdBackObjective = true;

                                state = backState;
                                this.stateText.setText(state);

                                this.time.delayedCall(1200, () => {
                                    this.appendToScroller(
                                        "Alfred: Great. Remember to use 'man' if you need assistance. Try it now with 'man ls'."
                                    );
                                });
                            }
                        }
                        // CD FUNCTIONALITY BELOW
                        else if (
                            cdState !== undefined &&
                            cdMap.get(state)?.includes(cdInput)
                        ) {
                            this.inputField.value = ""; // Empty the input field
                            this.appendToScroller(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );

                            if (!this.firstLsObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'ls' command first."
                                );
                            } else if (!this.cdObjective) {
                                cdDing.play();

                                state = newText.substring(3);
                                this.stateText.setText(state);
                                this.cdObjective = true;
                                this.time.delayedCall(1200, () => {
                                    this.appendToScroller(
                                        "Alfred: Great work. Your location has updated in the top right. Now view what's in the headquarters with the 'ls' command."
                                    );
                                });
                            }
                        }
                        // CD DIRECTORY NOT FOUND BELOW
                        else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.appendToScroller(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.appendToScroller("Directory not found");
                        }
                        // MAN INPUT BELOW
                    } else if (newText.substring(0, 4) == "man ") {
                        let manInput: string = newText.substring(4);
                        this.inputField.value = ""; // Empty the input field

                        this.appendToScroller(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );

                        const manState = manMap.get(manInput);
                        if (manState !== undefined) {
                            if (!this.firstLsObjective) {
                                ding.play();

                                this.appendToScroller(
                                    "Alfred: Try the 'ls' command first."
                                );
                            } else if (!this.cdObjective) {
                                ding.play();

                                this.appendToScroller(
                                    "Alfred: Try the 'cd headquarters' command first."
                                );
                            } else if (!this.secondLsObjective) {
                                ding.play();

                                this.appendToScroller(
                                    "Alfred: Try the 'ls' command again."
                                );
                            } else if (!this.rmObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'rm door_lock' command first."
                                );
                            } else if (!this.cdBackObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'cd ..' command first."
                                );
                            } else if (manInput != "ls" && !this.manObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'man ls' command first."
                                );
                            } else if (!this.manObjective) {
                                this.manObjective = true;

                                manDing.play();

                                this.appendToScroller(
                                    manMap.get(manInput) as string
                                );

                                this.time.delayedCall(2000, () => {
                                    this.appendToScroller(
                                        "Alfred: It seems you are ready to take on the mission. Remember that typing 'man alfred' will call me in for help."
                                    );
                                });
                            } else {
                                manDing.play();
                            }
                        } else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.appendToScroller(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.appendToScroller(
                                "Command '" + manInput + "' not found"
                            );
                        }
                    } else if (newText.substring(0, 3) == "rm ") {
                        let rmInput: string = newText.substring(3);
                        if (rmMap.get(state)?.includes(rmInput)) {
                            let files = lsMap.get(state) || "";
                            this.inputField.value = ""; // Empty the input field
                            this.appendToScroller(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );

                            if (!this.secondLsObjective) {
                                ding.play();
                                this.appendToScroller(
                                    "Alfred: Try the 'ls' command again."
                                );
                            } else if (!this.rmObjective) {
                                this.rmObjective = true;

                                files = files
                                    .replace(rmInput, "")
                                    .trim()
                                    .replace(/\s{2,}/g, " "); // Remove the file and extra spaces
                                lsMap.set(state, files);
                                rmDing.play();
                                this.appendToScroller(
                                    "File '" +
                                        rmInput +
                                        "' removed successfully."
                                );

                                this.time.delayedCall(1200, () => {
                                    this.appendToScroller(
                                        "Alfred: Perfect. You've removed the lock on the door. Try leaving the area with 'cd ..'."
                                    );
                                });
                            }
                        } else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.appendToScroller(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.appendToScroller(
                                "File '" +
                                    rmInput +
                                    "' cannot be found or removed."
                            );
                        }
                    }
                    // NONSENSE INPUT BELOW
                    else {
                        ding.play();
                        this.inputField.value = ""; // Empty the input field
                        this.appendToScroller(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );
                        this.appendToScroller(
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
            if (
                this.firstLsObjective &&
                this.secondLsObjective &&
                this.cdBackObjective &&
                this.rmObjective &&
                this.cdObjective &&
                this.manObjective
            ) {
                this.time.delayedCall(4000, () => {
                    winChime.play();
                    this.appendToScroller(
                        "Objective complete: Passed basic training. \nGood work, " +
                            this.username +
                            "!"
                    );
                    this.time.delayedCall(2000, this.loadLevel, [], this);
                });
            }
        });

        this.stateText = this.add.text(1075, 95, "pwd: " + state, {
            fontSize: "24px",
            color: "#fff",
        });
        this.events.on("shutdown", this.removeInputField, this);

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
        if (text.includes("Alfred")) {
            textNode.style.color = "gold";
            textNode.style.marginLeft = "40px";
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
        this.scroller.style.display = "none";
        this.scene.start("LevelSelect", {
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
    }
}
