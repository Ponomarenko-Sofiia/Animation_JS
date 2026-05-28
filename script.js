(function() {
    // 1. Створюємо canvas та додаємо його на сторінку
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#1a1a1a';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    // Вимикаємо згладжування, щоб піксель-арт залишався чітким
    canvas.style.imageRendering = 'pixelated';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // 2. Визначаємо розмір одного піксельного блока та палітру кольорів
    const pixelSize = 20; 
    const colors = {
        '.': null,         // Пустота
        'B': '#3a4454',    // Основний темно-сірий колір робота
        'L': '#536271',    // Світло-сірий для бліків та деталей
        'E': '#00ffcc',    // Бірюзовий для очей (світяться)
        'O': '#ff0055',    // Рожевий для серця/індикатора на грудях
        'A': '#8f94a0'     // Металеві антени та руки
    };

    // 3. Матриця персонажа (16x16 пікселів)
    const robotSprite = [
        '........A.......',
        '........A.......',
        '....LLLLLLLL....',
        '...LBBBBBBBBL...',
        '...LBEB..BEBL...',
        '...LBEB..BEBL...',
        '...LBBBBBBBBL...',
        '....LLLLLLLL....',
        '.....AABBAA.....',
        '....LBBBBBBL....',
        '...LBBBOBBOBL...',
        '...LBBBBBBBBL...',
        '....LLLLLLLL....',
        '.....A....A.....',
        '.....A....A.....',
        '....AA....AA....'
    ];

    let frame = 0;

    // 4. Функція малювання та анімації
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Розраховуємо зміщення для ефекту дихання (вгору-вниз) через синусоїду
        const breatheY = Math.floor(Math.sin(frame * 0.15) * 0.6);
        
        // Визначаємо, чи робот кліпає очима в цьому кадрі
        // Кліпання відбувається кожні ~150 кадрів і триває 10 кадрів
        const isBlinking = (frame % 150) > 140;

        // Центруємо робота на canvas
        const offsetX = (canvas.width - (16 * pixelSize)) / 2;
        const offsetY = (canvas.height - (16 * pixelSize)) / 2;

        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 16; col++) {
                let char = robotSprite[row][col];
                
                // Якщо порожній піксель — пропускаємо
                if (char === '.') continue;

                // Анімація кліпання: якщо це піксель ока ('E') і робот кліпає, міняємо колір на колір тіла ('B')
                if (char === 'E' && isBlinking) {
                    char = 'B';
                }

                // Анімація серця/індикатора ('O'): динамічно змінюємо яскравість кольору
                if (char === 'O') {
                    const pulse = Math.floor(Math.sin(frame * 0.2) * 40);
                    ctx.fillStyle = `rgb(${255 + pulse}, ${0}, ${85 + pulse})`;
                } else {
                    ctx.fillStyle = colors[char];
                }

                // Застосовуємо ефект "дихання" для голови та тулуба
                // Антени (рядки 0-1) та ноги (рядки 13-15) рухаються менше або залишаються на місці
                let currentY = offsetY + row * pixelSize;
                if (row >= 2 && row <= 12) {
                    currentY += breatheY * 4; // Рухаємо тіло вгору/вниз
                }

                const currentX = offsetX + col * pixelSize;

                // Малюємо піксельний блок
                ctx.fillRect(currentX, currentY, pixelSize, pixelSize);
            }
        }

        frame++;
        requestAnimationFrame(draw);
    }

    // Запуск анімації
    draw();
})();
