import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
    private stateText: Phaser.GameObjects.Text;
    private inputField: HTMLInputElement;
    private inputContainer: Phaser.GameObjects.Container;
    private timer: Phaser.GameObjects.Text;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private username: string;
    private lvl5: boolean;
    private firstLsObjective: boolean = false;
    private secondLsObjective: boolean = false;
    private cdObjective: boolean = false;
    private cdBackObjective: boolean = false;
    private manObjective: boolean = false;
    private rmObjective: boolean = false;
    private lastText: string[] = [""];
    private lastPosition: number = -1;

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
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.username = data.username;
        this.lvl5 = data.lvl5;
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
        let winChime = this.sound.add("winChime", { loop: false });

        this.inputContainer = this.add.container(360, 520);

        const maskGraphics = this.make.graphics();
        maskGraphics.fillRect(300, 185, 1080, 500);
        const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);

        this.inputContainer.setMask(mask);

        this.addTextToContainer(
            "Alfred: Welcome back " +
                this.username +
                ".\n\nIt has been quite a while so let's make sure\nyou are familiar with all the basic commands.\n\nType 'ls' to display the surroundings of \nyour current directory.\n"
        );

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
            "\nAlfred: The 'ls' command is useful\nfor viewing your surroundings."
        );
        manMap.set("rm", "Alfred: The 'rm' command\nneutralizes enemy files.");
        manMap.set(
            "cd",
            "\nAlfred: The 'cd' command\npermits you to navigate through rooms and items."
        );
        manMap.set(
            "alfred",
            "\nAlfred: Try using the 'cd' command to traverse through\ndifferent areas. Then use 'rm' to remove critical files."
        );

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
        this.add.text(500, 59, "Tutorial", {
            color: "#fff",
            fontSize: "47px",
            fontFamily: "Monospace",
        });

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
                        this.addTextToContainer(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );
                        this.addLsToContainer(lsMap.get(state) as string);

                        if (
                            !this.cdObjective &&
                            this.firstLsObjective &&
                            !this.secondLsObjective
                        ) {
                            this.addTextToContainer(
                                "\nAlfred: Try the 'cd headquarters' command first.\n"
                            );
                        } else if (
                            this.firstLsObjective &&
                            !this.secondLsObjective
                        ) {
                            this.secondLsObjective = true;

                            this.time.delayedCall(1500, () => {
                                this.addTextToContainer(
                                    "\nAlfred: There is a door_lock.\n\nTry removing it with 'rm door_lock'.\n"
                                );
                            });
                        } else if (
                            !this.firstLsObjective &&
                            !this.secondLsObjective
                        ) {
                            this.time.delayedCall(1500, () => {
                                this.firstLsObjective = true;

                                this.addTextToContainer(
                                    "\nAlfred: Good job, now you can see that Namuh's \nheadquarters is nearby.\n\nUse the 'cd headquarters' command to enter the directory.\n"
                                );
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
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            if (!this.secondLsObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'ls' command again.\n"
                                );
                            } else if (!this.rmObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'rm door_lock' command before leaving.\n"
                                );
                            } else if (!this.cdBackObjective) {
                                cdBackDing.play();

                                this.cdBackObjective = true;

                                state = backState;
                                this.stateText.setText(state);

                                this.time.delayedCall(1500, () => {
                                    this.addTextToContainer(
                                        "\nAlfred: Great. Remember to use 'man' if you need assistance.\nTry it now with 'man ls'.\n"
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
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );

                            if (!this.firstLsObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'ls' command first.\n"
                                );
                            } else if (!this.cdObjective) {
                                cdDing.play();

                                state = newText.substring(3);
                                this.stateText.setText(state);
                                this.cdObjective = true;
                                this.time.delayedCall(1500, () => {
                                    this.addTextToContainer(
                                        "\nAlfred: Great work. Your location has updated\nin the top right.\n\nNow view what's in the headquarters with the 'ls' command.\n"
                                    );
                                });
                            }
                        }
                        // CD DIRECTORY NOT FOUND BELOW
                        else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer("Directory not found");
                        }
                        // MAN INPUT BELOW
                    } else if (newText.substring(0, 4) == "man ") {
                        let manInput: string = newText.substring(4);
                        this.inputField.value = ""; // Empty the input field

                        this.addTextToContainer(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );

                        const manState = manMap.get(manInput);
                        if (manState !== undefined) {
                            if (!this.firstLsObjective) {
                                ding.play();

                                this.addTextToContainer(
                                    "\nAlfred: Try the 'ls' command first.\n"
                                );
                            } else if (!this.cdObjective) {
                                ding.play();

                                this.addTextToContainer(
                                    "\nAlfred: Try the 'cd headquarters' command first.\n"
                                );
                            } else if (!this.secondLsObjective) {
                                ding.play();

                                this.addTextToContainer(
                                    "\nAlfred: Try the 'ls' command again.\n"
                                );
                            } else if (!this.rmObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'rm door_lock' command first.\n"
                                );
                            } else if (!this.cdBackObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'cd ..' command first.\n"
                                );
                            } else if (manInput != "ls" && !this.manObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'man ls' command first.\n"
                                );
                            } else if (!this.manObjective) {
                                this.manObjective = true;

                                manDing.play();

                                this.addTextToContainer(
                                    manMap.get(manInput) as string
                                );

                                this.time.delayedCall(2000, () => {
                                    this.addTextToContainer(
                                        "\nAlfred: It seems you are ready to take on the mission.\n\nRemember that typing 'man alfred' will call me in for help.\n"
                                    );
                                });
                            } else {
                                manDing.play();
                            }
                        } else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer(
                                "Command '" + manInput + "' not found"
                            );
                        }
                    } else if (newText.substring(0, 3) == "rm ") {
                        let rmInput: string = newText.substring(3);
                        if (rmMap.get(state)?.includes(rmInput)) {
                            let files = lsMap.get(state) || "";
                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );

                            if (!this.secondLsObjective) {
                                ding.play();
                                this.addTextToContainer(
                                    "\nAlfred: Try the 'ls' command again.\n"
                                );
                            } else if (!this.rmObjective) {
                                this.rmObjective = true;

                                files = files
                                    .replace(rmInput, "")
                                    .trim()
                                    .replace(/\s{2,}/g, " "); // Remove the file and extra spaces
                                lsMap.set(state, files);

                                this.addTextToContainer(
                                    "File '" +
                                        rmInput +
                                        "' removed successfully."
                                );

                                this.time.delayedCall(1500, () => {
                                    this.addTextToContainer(
                                        "\nAlfred: Perfect. You've removed the lock on the door.\n\nTry leaving the area with 'cd ..'.\n"
                                    );
                                });
                            }
                        } else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer(
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
                        this.addTextToContainer(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );
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
            if (
                this.firstLsObjective &&
                this.secondLsObjective &&
                this.cdBackObjective &&
                this.rmObjective &&
                this.cdObjective &&
                this.manObjective
            ) {
                this.time.delayedCall(6000, () => {
                    winChime.play();
                    this.addTextToContainer(
                        "Objective complete: Passed basic training. \nGood work, " +
                            this.username +
                            "!"
                    );
                    this.time.delayedCall(2000, this.loadLevel, [], this);
                });
            }
        });

        this.stateText = this.add.text(1075, 95, state, {
            fontSize: "24px",
            color: "#fff",
        });
        this.events.on("shutdown", this.removeInputField, this);
    }
    removeInputField() {
        if (this.inputField.parentElement) {
            this.inputField.parentElement.removeChild(this.inputField);
        }
    }
    update() {}

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

    loadLevel() {
        this.removeInputField();

        this.scene.start("LevelSelect", {
            username: this.username,
            lvl2: this.lvl2,
            lvl3: this.lvl3,
            lvl4: this.lvl4,
            lvl5: this.lvl5,
        });
    }
}
