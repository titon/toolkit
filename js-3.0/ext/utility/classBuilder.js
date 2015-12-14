export default function classBuilder(classes) {
    let className = [];

    if (classes) {
        Object.keys(classes).forEach(key => {
            if (classes[key]) {
                className.push(key);
            }
        });
    }

    return className.join(' ');
}
