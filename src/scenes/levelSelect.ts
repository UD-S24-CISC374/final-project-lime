import Phaser from "phaser";

export default class LevelSelect extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Arcade.Sprite;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private doors?: Phaser.Physics.Arcade.StaticGroup;
    private greenLights?: Phaser.Physics.Arcade.StaticGroup;
    private lvl1?: boolean = true;
    private lvl2?: boolean = false;
    private lvl3?: boolean = false;
    private lvl4?: boolean = false;
    private lvl5?: boolean = false;
    private popupBackground: Phaser.GameObjects.Graphics;
    private popupQuestion: Phaser.GameObjects.Text;
    private popupNoText: Phaser.GameObjects.Text;
    private popupYesText: Phaser.GameObjects.Text;
    private time1?: number = NaN;
    private time2?: number = NaN;
    private time3?: number = NaN;
    private time4?: number = NaN;
    private time5?: number = NaN;

    private username: string;
    private lastDirection: string;
    private doorPositions: {
        x: number;
        Ustate: boolean;
        scene: string;
    }[];
    private walkSound: Phaser.Sound.BaseSound | undefined;
    private isWalking = false;

    constructor() {
        super({ key: "LevelSelect" });
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
        this.username = data.username;

        if (this.username === "admin") {
            this.lvl2 = true;
            this.lvl3 = true;
            this.lvl4 = true;
            this.lvl5 = true;
            this.time1 = data.time1;
            this.time2 = data.time2;
            this.time3 = data.time3;
            this.time4 = data.time4;
            this.time5 = data.time5;
            console.log("time1 lobby: " + this.time1);
        } else {
            this.lvl2 = data.lvl2;
            this.lvl3 = data.lvl3;
            this.lvl4 = data.lvl4;
            this.lvl5 = data.lvl5;
            this.time1 = data.time1;
            this.time2 = data.time2;
            this.time3 = data.time3;
            this.time4 = data.time4;
            this.time5 = data.time5;
            console.log(this.time1);
        }
        this.lvl1 = true;
    }

    preload() {
        this.load.audio("menuMusic", ["assets/Audio/menuMusic.mp3"]);
        this.load.image("sign", ["assets/LevelSelect/sign.png"]);
        this.load.image("backdrop", ["assets/Backgrounds/Levelselect.png"]);
        this.load.image("timer", ["assets/LevelSelect/timeBox.png"]);
    }

    create() {
        this.platforms = this.physics.add.staticGroup();
        this.cameras.main.setBackgroundColor("#332211");

        const groundWidth = this.scale.width * 5;
        const groundX = (this.scale.width * 5) / 2;

        const ground = this.platforms.create(
            groundX,
            648,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;

        ground
            .setScale(groundWidth / ground.width, 6)
            .refreshBody()
            .setTint(0x000000);

        this.add.image(525, 373, "backdrop").setScale(0.535);
        this.add.image(1483, 373, "backdrop").setScale(0.535);
        this.add.image(2441, 373, "backdrop").setScale(0.535);
        this.add.image(3399, 373, "backdrop").setScale(0.535);
        this.add.image(4357, 373, "backdrop").setScale(0.535);

        this.add.image(250, 230, "sign").setScale(0.9);
        this.add.image(480, 440, "timer").setScale(0.35);
        this.add.image(1440, 440, "timer").setScale(0.35);
        this.add.image(2400, 440, "timer").setScale(0.35);
        this.add.image(3360, 440, "timer").setScale(0.35);
        this.add.image(4320, 440, "timer").setScale(0.35);

        const timerText1 = {
            font: "15px Impact", // Adjust the size and font as necessary
            fill: "#ab1703", // Red text color
        };
        const timerText2 = {
            font: "15px Impact",
            fill: "#09ab03", //green text color
        };
        const levelText = {
            fontFamily: "Impact",
            fill: "#756b64",
            fontSize: "40px",
        };
        let times = [
            this.time1,
            this.time2,
            this.time3,
            this.time4,
            this.time5,
        ];
        let xPos = [480, 1440, 2400, 3360, 4320];
        let ct = 0;
        for (let time of times) {
            this.add
                .text(
                    xPos[ct], // X position adjusted for centering, assuming text width around 200px
                    440, // Y position just below the sign (sign height plus some margin)
                    time ? String(time.toFixed(2)) : "0.00",
                    time ? timerText2 : timerText1
                )
                .setOrigin(0.5, 0.3); // Centers the text horizontally relative to its position
            ct++;
        }

        const walls = [{ x: -357 }, { x: 4555 }];

        walls.forEach((pos) => {
            this.platforms
                ?.create(pos.x, 0, "ground")
                .setOrigin(0, 0)
                .setScale(1, this.scale.height)
                .refreshBody()
                .setTint(0x000000);
        });

        this.add.text(150, 160, "Move: ← →\n\nJump: ↑ \n\nEnter doors: ↑", {
            fontFamily: "Arial",
            fontSize: 25,
            color: "#000000",
        });

        const levelTextPositions = [
            { x: 470, level: "1" },
            { x: 1430, level: "2" },
            { x: 2390, level: "3" },
            { x: 3350, level: "4" },
            { x: 4310, level: "5" },
        ];
        levelTextPositions.forEach((pos) => {
            this.add.text(pos.x, 375, pos.level, levelText);
        });

        // this.player = this.physics.add.sprite(250, 370, "spy");
        this.player = this.physics.add.sprite(250, 370, "dude").setScale(0.2);
        this.player.setCollideWorldBounds(false);
        this.player.setDepth(1);
        this.cameras.main.setBounds(0, 0, 4595, this.scale.height);

        this.cameras.main.startFollow(this.player);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 7,
                end: 0,
            }),
            frameRate: 18,
            repeat: -1,
        });
        this.anims.create({
            key: "upright",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 18,
                end: 21,
            }),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "upleft",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 21,
                end: 18,
            }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "idleLeft",
            frames: [{ key: "dude", frame: 8 }],
            frameRate: 12,
        });
        this.anims.create({
            key: "idleRight",
            frames: [{ key: "dude", frame: 9 }],
            frameRate: 12,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 10,
                end: 17,
            }),
            frameRate: 18,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard?.createCursorKeys();

        this.doors = this.physics.add.staticGroup();
        this.doors.setDepth(0);
        this.greenLights = this.physics.add.staticGroup();

        const wallDoor = this.doors.create(
            48,
            507,
            "wallDoor"
        ) as Phaser.Physics.Arcade.Sprite;
        wallDoor.setScale(0.25).refreshBody();
        const backDoor = this.doors.create(
            79,
            507,
            "backwardsDoor"
        ) as Phaser.Physics.Arcade.Sprite;
        backDoor.setScale(0.25).refreshBody().setVisible(false);

        this.physics.add.overlap(this.player, wallDoor, () => {
            wallDoor.setVisible(false);
            backDoor.setVisible(true);
            this.player?.setVisible(false);
            this.player?.setY(590);
            this.time.delayedCall(600, () => {
                wallDoor.setVisible(true);
                backDoor.setVisible(false);
                this.time.delayedCall(600, () => {
                    this.createPopup();
                });
            });
        });

        //level doors

        this.doorPositions = [
            {
                x: 480,
                Ustate: this.lvl1 || false,
                scene: "LoadingScene1",
            },
            {
                x: 1440,
                Ustate: this.lvl2 || false,
                scene: "LoadingScene2",
            },
            {
                x: 2400,
                Ustate: this.lvl3 || false,
                scene: "LoadingScene3",
            },
            {
                x: 3360,
                Ustate: this.lvl4 || false,
                scene: "LoadingScene4",
            },
            {
                x: 4320,
                Ustate: this.lvl5 || false,
                scene: "LoadingScene5",
            },
        ];

        this.popupBackground = this.add.graphics();
        this.popupBackground.fillStyle(0x000000, 0.7);
        this.popupBackground.fillRect(330, 200, 600, 200);

        // Add text for the question
        this.popupQuestion = this.add
            .text(635, 270, "Do you want to enter \nthe tutorial again?", {
                fontSize: "30px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // Add text for 'Yes' option
        this.popupYesText = this.add
            .text(550, 350, "Yes", {
                fontSize: "30px",
                color: "#000",
                backgroundColor: "gold",
                padding: {
                    left: 8,
                    right: 8,
                    top: 2,
                    bottom: 2,
                },
            })
            .setOrigin(0.5)
            .on("pointerover", () => {
                this.yesHoverState();
            })
            .on("pointerout", () => {
                this.yesRestState();
            });

        // Add text for 'No' option
        this.popupNoText = this.add
            .text(700, 350, "No", {
                fontSize: "30px",
                color: "#000",
                backgroundColor: "gold",
                padding: {
                    left: 8,
                    right: 8,
                    top: 2,
                    bottom: 2,
                },
            })
            .setOrigin(0.5);

        // Enable input on 'Yes' and 'No' text
        this.popupYesText.setInteractive();
        this.popupNoText.setInteractive();

        // Add pointer down event for 'Yes' option
        this.popupYesText
            .on("pointerdown", () => {
                this.closePopup();

                this.scene.start("IntroScene", {
                    username: this.username,
                    lvl1: this.lvl1,
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
            })
            .on("pointerover", () => {
                this.yesHoverState();
            })
            .on("pointerout", () => {
                this.yesRestState();
            });

        // Add pointer down event for 'No' option
        this.popupNoText
            .setInteractive()
            .on("pointerdown", () => {
                this.player?.setVisible(true);
                this.player?.setY(100);
                this.player?.setX(200);
                this.closePopup();
            })
            .on("pointerover", () => {
                this.noHoverState();
            })
            .on("pointerout", () => {
                this.noRestState();
            });

        this.popupBackground.setVisible(false);
        this.popupQuestion.setVisible(false);
        this.popupYesText.setVisible(false);
        this.popupNoText.setVisible(false);
    }

    createPopup() {
        this.popupBackground.setVisible(true);
        this.popupQuestion.setVisible(true);
        this.popupYesText.setVisible(true);
        this.popupNoText.setVisible(true);
    }

    closePopup() {
        this.popupBackground.setVisible(false);
        this.popupQuestion.setVisible(false);
        this.popupYesText.setVisible(false);
        this.popupNoText.setVisible(false);
    }

    noHoverState() {
        this.popupNoText.setStyle({ fill: "#333" });
        this.popupNoText.setStyle({ backgroundColor: "yellow" });
    }

    noRestState() {
        this.popupNoText.setStyle({ backgroundColor: "gold" });
        this.popupNoText.setStyle({ fill: "black" });
    }

    yesHoverState() {
        this.popupYesText.setStyle({ fill: "#333" });
        this.popupYesText.setStyle({ backgroundColor: "yellow" });
    }

    yesRestState() {
        this.popupYesText.setStyle({ backgroundColor: "gold" });
        this.popupYesText.setStyle({ fill: "black" });
    }

    update() {
        if (!this.cursors) {
            return;
        }
        if (!this.lastDirection) {
            this.lastDirection = "right"; // Assuming player starts facing right
        }

        if (this.player && this.doors) {
            this.doorPositions.forEach((door) => {
                const closedDoor = this.doors?.create(
                    door.x,
                    507,
                    door.Ustate ? "closed_metal_door" : "lockedDoor"
                ) as Phaser.Physics.Arcade.Sprite;
                closedDoor.setScale(0.25).refreshBody();
                closedDoor.setVisible(true);
                //add green light

                // Optional: Add an effect to make the light 'glow'

                const openDoor = this.doors?.create(
                    door.x,
                    507,
                    "open_metal_door"
                ) as Phaser.Physics.Arcade.Sprite;
                openDoor.setScale(0.25).refreshBody();
                openDoor.setVisible(false);
                if (
                    this.player &&
                    door.Ustate &&
                    Phaser.Geom.Intersects.RectangleToRectangle(
                        closedDoor.getBounds(),
                        this.player.getBounds()
                    )
                ) {
                    closedDoor.setVisible(false);
                    openDoor.setVisible(true);

                    if (this.cursors?.up.isDown && openDoor.visible) {
                        this.tweens.add({
                            targets: this.player,
                            duration: 500,
                            scaleX: 0,
                            scaleY: 0,
                            angle: 360,
                            y: "-=40",
                            onComplete: () => {
                                this.time.delayedCall(1000, () => {
                                    this.sound.stopAll();
                                    console.log("time1 now: " + this.time1);
                                    this.scene.start(door.scene, {
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
                                });
                            },
                        });
                    }
                } else {
                    openDoor.setVisible(false);
                    closedDoor.setVisible(true);
                }
            });

            if (this.cursors.left.isDown && this.player.body?.touching.down) {
                this.player.setVelocityX(-400);
                this.player.anims.play("left", true);
                this.tweens.add({
                    targets: this.player,
                    duration: 180, // Duration of the tween in milliseconds
                    scaleX: 0.2, // New X scale value
                    scaleY: 0.2, // New Y scale value
                });
                this.lastDirection = "left"; // Update last movement direction
                this.isWalking = true;
            } else if (
                this.cursors.right.isDown &&
                this.player.body?.touching.down
            ) {
                this.player.setVelocityX(400);
                this.player.anims.play("right", true);
                this.tweens.add({
                    targets: this.player,
                    duration: 180, // Duration of the tween in milliseconds
                    scaleX: 0.2, // New X scale value
                    scaleY: 0.2, // New Y scale value
                });
                this.lastDirection = "right"; // Update last movement direction
                this.isWalking = true;
            } else if (
                this.cursors.right.isDown &&
                !this.player.body?.touching.down
            ) {
                this.player.setVelocityX(400);
                this.player.anims.play("upright", true);
                this.tweens.add({
                    targets: this.player,
                    duration: 180, // Duration of the tween in milliseconds
                    scaleX: 0.12, // New X scale value
                    scaleY: 0.12, // New Y scale value
                });
                this.lastDirection = "right"; // Update last movement direction
                this.isWalking = false;
            } else if (
                this.cursors.left.isDown &&
                !this.player.body?.touching.down
            ) {
                this.player.setVelocityX(-400);
                this.player.anims.play("upleft", true);
                this.tweens.add({
                    targets: this.player,
                    duration: 180, // Duration of the tween in milliseconds
                    scaleX: 0.12, // New X scale value
                    scaleY: 0.12, // New Y scale value
                });
                this.lastDirection = "left"; // Update last movement direction
                this.isWalking = false;
            } else {
                this.player.setVelocityX(0);
                this.isWalking = false;

                if (
                    !this.player.body?.touching.down &&
                    this.lastDirection === "right"
                ) {
                    this.player.anims.play("upright", true);
                    this.tweens.add({
                        targets: this.player,
                        duration: 180, // Duration of the tween in milliseconds
                        scaleX: 0.12, // New X scale value
                        scaleY: 0.12, // New Y scale value
                    });
                } else if (
                    !this.player.body?.touching.down &&
                    this.lastDirection === "left"
                ) {
                    this.player.anims.play("upleft", true);
                    this.tweens.add({
                        targets: this.player,
                        duration: 180, // Duration of the tween in milliseconds
                        scaleX: 0.12, // New X scale value
                        scaleY: 0.12, // New Y scale value
                    });
                } else if (this.lastDirection === "left") {
                    this.player.anims.play("idleLeft", true);
                    this.tweens.add({
                        targets: this.player,
                        duration: 180, // Duration of the tween in milliseconds
                        scaleX: 0.2, // New X scale value
                        scaleY: 0.2, // New Y scale value
                    });
                } else {
                    this.player.anims.play("idleRight", true);
                    this.tweens.add({
                        targets: this.player,
                        duration: 180, // Duration of the tween in milliseconds
                        scaleX: 0.2, // New X scale value
                        scaleY: 0.2, // New Y scale value
                    });
                }
            }

            if (this.isWalking) {
                if (!this.walkSound) {
                    this.walkSound = this.sound.add("walk");
                    this.walkSound.play({ loop: true, rate: 2 });
                    this.walkSound.play();
                }
            } else {
                if (this.walkSound) {
                    this.walkSound.stop();
                    this.walkSound = undefined;
                }
            }

            if (this.player.body?.velocity.y !== 0) {
                if (this.walkSound) {
                    this.walkSound.stop();
                    this.walkSound = undefined;
                }
            }

            if (this.cursors.up.isDown && this.player.body?.touching.down) {
                let jumpSound = this.sound.add("jump");
                jumpSound.play({ volume: 0.5 });

                this.player.setVelocityY(-300);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(300);
            }
        }
    }
}
