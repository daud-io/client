export class Camera {
    constructor(size, settings = {}) {
        this.distance = 1500.0;
        this.lookat = [0, 0];
        this.size = size;
        this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [1.0, 1.0]
        };
        this.updateViewport();
    }

    updateViewport() {
        this.aspectRatio = this.size.width / this.size.height;
        this.viewport.width = this.distance * Math.tan(this.fieldOfView);
        this.viewport.height = this.viewport.width / this.aspectRatio;
        this.viewport.left = this.lookat[0] - this.viewport.width / 2.0;
        this.viewport.top = this.lookat[1] - this.viewport.height / 2.0;
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale[0] = this.size.width / this.viewport.width;
        this.viewport.scale[1] = this.size.height / this.viewport.height;
    }

    zoomTo(z) {
        this.distance = z;
        this.updateViewport();
    }

    moveTo(x, y) {
        this.lookat[0] = x;
        this.lookat[1] = y;
        this.updateViewport();
    }

    screenToWorld(x, y, obj = {}) {
        obj.x = x / this.viewport.scale[0] + this.viewport.left;
        obj.y = y / this.viewport.scale[1] + this.viewport.top;
        return obj;
    }
}
