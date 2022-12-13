
export const onClickOutSide = (target: Element, callback: () => void, ignore?: any[]) => {
    document.addEventListener("click", (event) => {
        const outsideClick = typeof event.composedPath === 'function' && !event.composedPath().includes(target);
        if (outsideClick) {
            var path = event.composedPath();
            console.log(ignore);
            if (ignore?.some(i => path.includes(document.querySelector(i)))) {
                return;
            }
            callback();
        }
    })
}
export const makeDraggable = (movement_target?: HTMLElement, target?: HTMLElement) => {
    var offset = { x: 0, y: 0 };
    if (movement_target) {
        movement_target.style.cursor = "move";
    }
    movement_target?.addEventListener("mousedown", (e) => {
        if (target) {
            offset.x = e.clientX - target.offsetLeft;
            offset.y = e.clientY - target.offsetTop;
            window.addEventListener('mousemove', move, true);

        }
    });
    const move = (e: MouseEvent) => {
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;
        target!.style.top = top + 'px';
        target!.style.left = left + 'px';
    }
    window?.addEventListener("mouseup", (e) => {
        window.removeEventListener('mousemove', move, true);
    })
}