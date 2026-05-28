(function () {
    // =========================
    // ПІДГОТОВКА СТОРІНКИ
    // =========================
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.background = `
        radial-gradient(circle at center, #222 0%, #111 50%, #050505 100%)
    `;
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.body.style.fontFamily = 'sans-serif';

    // =========================
    // КНОПКА
    // =========================
    const button = document.createElement('button');
    button.textContent = 'Змінити анімацію';
    button.style.marginBottom = '20px';
    button.style.padding = '12px 22px';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';
    button.style.background = '#00ffcc';
    button.style.color = '#111';
    button.style.fontWeight = 'bold';
    button.style.fontSize = '16px';
    button.style.boxShadow = '0 0 20px rgba(0,255,200,0.4)';
    button.style.transition = '0.2s';

    button.onmouseenter = () => {
        button.style.transform = 'scale(1.05)';
    };

    button.onmouseleave = () => {
        button.style.transform = 'scale(1)';
    };

    document.body.appendChild(button);

    // =========================
    // CANVAS
    // =========================
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 500;
    canvas.style.imageRendering = 'pixelated';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // =========================
    // НАЛАШТУВАННЯ
    // =========================
    const pixelSize = 12;

    const colors = {
        '.': null,
        'B': '#3a4454',
        'L': '#5c6d7e',
        'D': '#222831',
        'E': '#00ffcc',
        'O': '#ff0055',
        'A': '#9aa3ad',
        'S': '#7dffef'
    };

    // =========================
    // ДЕТАЛІЗОВАНИЙ РОБОТ
    // =========================
    const robotSprite = [
        '.........AA.........',
        '........AAAA........',
        '......LLLLLLLL......',
        '.....LLBBBBBBLL.....',
        '....LBBEEEEEEBBL....',
        '....LBBEEEEEEBBL....',
        '....LBBBBBBBBBBL....',
        '.....LLBBBBBBLL.....',
        '......AALBBLAA......',
        '.....LBBBBBBBBL.....',
        '....LBBBBOOBBBBL....',
        '....LBBBBBBBBBBL....',
        '.....LLBBBBBBLL.....',
        '......AABB BAA......'.replace(/ /g,'.'),
        '......AA....AA......',
        '.....AAA....AAA.....',
        '.....AA......AA.....',
        '....AA........AA....'
    ];

    let frame = 0;

    // false = idle
    // true = mowing
    let mowingMode = false;

    button.onclick = () => {
        mowingMode = !mowingMode;
    };

    // =========================
    // ФОН
    // =========================
    const stars = [];

    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2
        });
    }

    function drawBackground() {
        for (const star of stars) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random()})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }
    }

    // =========================
    // МАЛЮВАННЯ РОБОТА
    // =========================
    function drawRobot(x, y) {

        const breatheY = Math.sin(frame * 0.08) * 4;
        const isBlinking = (frame % 160) > 150;

        // Рух косіння
        let armOffset = 0;
        let bodyTilt = 0;
        let mowerOffset = 0;

        if (mowingMode) {
            armOffset = Math.sin(frame * 0.3) * 20;
            bodyTilt = Math.sin(frame * 0.15) * 3;
            mowerOffset = Math.sin(frame * 0.3) * 8;
        }

        for (let row = 0; row < robotSprite.length; row++) {

            for (let col = 0; col < robotSprite[row].length; col++) {

                let char = robotSprite[row][col];

                if (char === '.') continue;

                if (char === 'E' && isBlinking) {
                    char = 'B';
                }

                // Світіння очей
                if (char === 'E') {
                    const glow = Math.sin(frame * 0.2) * 50;

                    ctx.fillStyle = `
                        rgb(
                            0,
                            ${255},
                            ${200 + glow}
                        )
                    `;
                }

                // Серце
                else if (char === 'O') {
                    const pulse = Math.sin(frame * 0.25) * 70;

                    ctx.fillStyle = `
                        rgb(
                            ${255},
                            ${30 + pulse},
                            ${100 + pulse}
                        )
                    `;
                }

                else {
                    ctx.fillStyle = colors[char];
                }

                let px = x + col * pixelSize;
                let py = y + row * pixelSize;

                // Дихання
                if (row >= 2 && row <= 12) {
                    py += breatheY;
                }

                // Кошення
                if (mowingMode) {

                    // Права рука
                    if (col > 13 && row > 7 && row < 14) {
                        px += armOffset;
                        py += mowerOffset;
                    }

                    // Ліва рука
                    if (col < 6 && row > 7 && row < 14) {
                        px -= armOffset * 0.5;
                    }

                    px += bodyTilt;
                }

                ctx.fillRect(px, py, pixelSize, pixelSize);

                // Блік
                if (char === 'L') {
                    ctx.fillStyle = 'rgba(255,255,255,0.08)';
                    ctx.fillRect(px, py, pixelSize / 2, pixelSize / 2);
                }
            }
        }

        // =========================
        // КОСАРКА
        // =========================
        if (mowingMode) {

            const mowerX = x + 250 + Math.sin(frame * 0.3) * 8;
            const mowerY = y + 170;

            // Корпус
            ctx.fillStyle = '#cc2222';
            ctx.fillRect(mowerX, mowerY, 90, 40);

            // Верх
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(mowerX + 10, mowerY - 10, 50, 10);

            // Колеса
            ctx.fillStyle = '#111';

            ctx.beginPath();
            ctx.arc(mowerX + 15, mowerY + 42, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(mowerX + 75, mowerY + 42, 12, 0, Math.PI * 2);
            ctx.fill();

            // Ручка
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 5;

            ctx.beginPath();
            ctx.moveTo(mowerX + 80, mowerY);
            ctx.lineTo(mowerX + 120, mowerY - 60);
            ctx.stroke();

            // Трава
            for (let i = 0; i < 12; i++) {

                const gx = mowerX - 20 + Math.random() * 30;
                const gy = mowerY + 35 + Math.random() * 10;

                ctx.strokeStyle = `rgba(0,255,120,${Math.random()})`;

                ctx.beginPath();
                ctx.moveTo(gx, gy);
                ctx.lineTo(
                    gx - Math.random() * 20,
                    gy - Math.random() * 15
                );
                ctx.stroke();
            }

            // Іскри
            for (let i = 0; i < 8; i++) {

                ctx.fillStyle = `rgba(255,200,50,${Math.random()})`;

                ctx.fillRect(
                    mowerX + Math.random() * 20,
                    mowerY + 35 + Math.random() * 10,
                    3,
                    3
                );
            }
        }
    }

    // =========================
    // ЗЕМЛЯ
    // =========================
    function drawGround() {

        ctx.fillStyle = '#133d1a';
        ctx.fillRect(0, 420, canvas.width, 80);

        for (let i = 0; i < canvas.width; i += 8) {

            const h = Math.random() * 15;

            ctx.strokeStyle = '#2aff66';

            ctx.beginPath();
            ctx.moveTo(i, 420);
            ctx.lineTo(i, 420 - h);
            ctx.stroke();
        }
    }

    // =========================
    // ГОЛОВНИЙ ЦИКЛ
    // =========================
    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();

        drawGround();

        drawRobot(180, 120);

        frame++;

        requestAnimationFrame(draw);
    }

    draw();

})();
