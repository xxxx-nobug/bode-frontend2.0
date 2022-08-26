const AC_GAME_OBJECTS = [];

export class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0; // 每秒间的时间间隔
        this.has_called_start = false; // 标记是否已经开始游戏
    }

    start() {  // 只执行一次
    }

    update() {  // 每一帧执行一次，除了第一帧之外

    }

    on_destroy() {  // 删除之前执行

    }

    destroy() {
        this.on_destroy();

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i); // 删除从下标i开始的所有元素splice(i, 1)
                break;
            }
        }
    }
}

let last_timestamp;  // 上一次执行的时刻
const step = timestamp => {
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_called_start) { // 如果没有开始游戏则执行start
            obj.has_called_start = true;
            obj.start();
        } else { // 已经开始了那就执行update
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step) // 每一帧调用（js的一个api）
}

requestAnimationFrame(step)
