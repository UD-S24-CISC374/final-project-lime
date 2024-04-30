import Phaser from "phaser";

export default class Manual extends Phaser.GameObjects.Sprite {
    manualText: string;
    manualOpen: boolean;
    manualContainer: Phaser.GameObjects.Container;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y, "ClosedBook");
        this.scene = scene;
        this.manualText = text;
        this.manualOpen = false;

        // Adding the sprite to the scene and scaling it down
        this.scene.add.existing(this);
        this.setScale(0.3); // Scale down the sprite
        this.setInteractive({ cursor: "pointer" });

        // Handling hover events
        this.on("pointerover", () => {
            this.setTexture(this.manualOpen ? "OpenBook" : "HoveredBook");
            this.setScale(0.35); // Scale up a bit when hovered
        });

        this.on("pointerout", () => {
            this.setTexture(this.manualOpen ? "OpenBook" : "ClosedBook");
            this.setScale(0.3); // Return to original scaled down size
        });

        // Handling click events
        this.on("pointerdown", () => {
            this.manualOpen = !this.manualOpen;
            this.setTexture(this.manualOpen ? "OpenBook" : "HoveredBook");
            this.manualContainer.setVisible(this.manualOpen);
            if (this.manualOpen) {
                this.displayManual();
            }
        });

        // Create a container for manual text right under the book
        let manualHeight = 270; // available space between the sprite and the text entry box
        let manualWidth = 300; // an approximate width based on the screenshot
        let manualX = 20; // starting X coordinate under the sprite
        let manualY = 175; // starting Y coordinate right below the sprite
        this.manualContainer = this.scene.add.container(manualX, manualY);

        let graphics = this.scene.add.graphics();
        graphics.fillStyle(0x21201f, 0.8); // Grey background with opacity
        graphics.lineStyle(4, 0xffd700); // Yellow border
        graphics.strokeRoundedRect(0, 0, manualWidth, manualHeight, 20); // x, y, width, height, radius
        graphics.fillRoundedRect(0, 0, manualWidth, manualHeight, 20);
        this.manualContainer.add(graphics);

        let textObject = this.scene.add.text(5, 20, this.manualText, {
            font: "bold 16px 'Courier New'",
            color: "#ffd700", // Text color matches the border
            wordWrap: { width: manualWidth - 10 },
            align: "left", // Left align text
        });
        this.manualContainer.add(textObject);
        this.manualContainer.setVisible(false);
    }

    displayManual() {
        this.scene.tweens.add({
            targets: this.manualContainer.list,
            scaleY: 1,
            scaleX: 1,
            duration: 300,
            ease: "Power2",
        });
        this.manualContainer.setVisible(true);
    }

    setManualText(newText: string) {
        this.manualText = newText;
        (this.manualContainer.list[1] as Phaser.GameObjects.Text).setText(
            newText
        );
    }
}
