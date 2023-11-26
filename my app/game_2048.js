var board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
const n = 4;

var prev_count = {
    "up": true,
    "down": true,
    "left": true,
    "right": true
};

function _2048() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    let x = getRandFromZeroToN(n);
    let y = getRandFromZeroToN(n);

    board[x][y] = getRandomOf2OR4();
    let pos = getIndexOfAllEmptyPos(board);
    pos = getRandomPos(pos);
    board[pos[0]][pos[1]] = getRandomOf2OR4();

    return pos;
}

function print(board) {
    board.map(function(row) {
        console.log(row);
    });
    console.log();
}

function getIndexOfAllEmptyPos(board) {
    emptyPos = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0)
                emptyPos.push([i, j]);
        }
    }
    return emptyPos;
}

function getRandFromZeroToN(n) {
    return Math.floor(Math.random() * n);
}

function getRandomPos(posList) {
    return posList[getRandFromZeroToN(posList.length)];
}

function getRandomOf2OR4() {
    return Math.random() > 0.7 ? 2 : 4;
}

function tiltLeft(board) {
    let score = 0;
    board.map((row) => {
        score += swipe(row);
    });
    return score;
}

function tiltRight(board) {
    let score = 0;
    board.map(function(row) {
        row.reverse();
        score += swipe(row);
        row.reverse();
    });
    return score;
}

function tiltUp(board) {
    let score = 0;
    transpose(board);
    board.map(function(row) {
        score += swipe(row);
    });
    transpose(board);
    return score;
}

function tiltDown(board) {
    let score = 0;
    transpose(board);
    board.map(function(row) {
        row.reverse();
        score += swipe(row);
        row.reverse();
    });
    transpose(board);
    return score;
}

function transpose(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < i; j++) {
            const tmp = board[i][j];
            board[i][j] = board[j][i];
            board[j][i] = tmp;
        }
    }
}

function swipe(row) {
    let n = row.length;
    let last_merge = -1;
    let score = 0;
    for (let left = 1; left < n; left++) {
        if (row[left] === 0)
            continue;
        else {
            for (let i = left - 1; i > last_merge; i--) {
                if (row[i] === row[left]) {
                    row[i] *= 2;
                    row[left] = 0;
                    score += row[i];
                    last_merge = i;
                    break;
                } else if (i === 0 && row[i] === 0) {
                    row[i] = row[left];
                    row[left] = 0;
                } else if (row[i] !== 0) {
                    row[i + 1] = row[left];
                    if (i + 1 != left) {
                        row[left] = 0;
                    }
                    break;
                } else if (last_merge + 1 == i) {
                    row[i] = row[left];
                    row[left] = 0;
                    break;
                }
            }
        }
    }
    return score;
}

function renderDisplay(just) {
    if (typeof document !== 'undefined') {
        let boardx = document.querySelector('#boardx');
        let htmlTemplate = `${document.getElementById('score-card').outerHTML}`;
        for (let i = 0; i < n; i++) {
            htmlTemplate += ` <tr class="rowx">`;
            for (let j = 0; j < n; j++) {
                htmlTemplate += `<td class="blockx c${board[i][j]} ${just.i==i && just.j==j?'cur':''}">${  board[i][j]===0? ' ' : board[i][j] }</td>`;
            }
            htmlTemplate += `</tr>`;
        }
        boardx.innerHTML = htmlTemplate;
    }
}

function restart() {
    if (typeof document !== 'undefined') {
        document.querySelector('.modal').style = "display:block;";
    }
}

if (typeof document !== 'undefined') {
    document.querySelector(".reset").addEventListener('click', () => {
        let pos = _2048();
        document.querySelector('#score').innerHTML = 0;
        renderDisplay({ 'i': pos[0], 'j': pos[1] });
    });

    document.onkeydown = function(event) {
        let prev = JSON.stringify(board);
        let score = 0;
        switch (event.keyCode) {
            case 37:
                score = tiltLeft(board);
                if (JSON.stringify(board) == prev)
                    prev_count.left = true;
                break;
            case 38:
                score = tiltUp(board);
                if (JSON.stringify(board) == prev)
                    prev_count.up = true;
                break;
            case 39:
                score = tiltRight(board);
                if (JSON.stringify(board) == prev)
                    prev_count.right = true;
                break;
            case 40:
                if (JSON.stringify(board) == prev)
                    score = tiltDown(board);
                prev_count.down = true;
                break;
        }

        let emptypos = getIndexOfAllEmptyPos(board);

        if (emptypos.length === 0) {
            if (prev_count.up && prev_count.down && prev_count.left && prev_count.right) {
                restart();
                document.querySelector('#score').innerHTML = 0;
            }
        } else if (JSON.stringify(board) !== prev) {
            let pos = getRandomPos(emptypos);
            board[pos[0]][pos[1]] = getRandomOf2OR4();
            if (score !== 0) {
                let scoreBoard = parseInt(document.querySelector('#score').innerHTML);
                scoreBoard += score;
                document.querySelector('#plusx').innerHTML = `<span id="plus">+${score}</span>`;
                document.querySelector('#score').innerHTML = scoreBoard;
                if (parseInt(document.querySelector('#best').innerHTML) < scoreBoard)
                    document.querySelector('#best').innerHTML = scoreBoard;
            } else {
                document.querySelector('#plusx').innerHTML = `<span></span>`;
            }
            renderDisplay({ 'i': pos[0], 'j': pos[1] });
            prev_count.right = false;
            prev_count.up = false;
            prev_count.down = false;
            prev_count.left = false;
        }
    };

    document.querySelector('.restart').addEventListener('click', () => {
        let xy = _2048();
        renderDisplay({ 'i': xy[0], 'j': xy[1] });
        document.querySelector('.modal').style = "display:none;";
    });

    let poss = _2048();
    renderDisplay({ 'i': poss[0], 'j': poss[1] });
}
