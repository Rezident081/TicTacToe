class Playground{
    constructor(){
        this.main = document.getElementById('playground');
        this.replayButton = document.getElementById('restart');
        this.winnerRef = document.getElementsByClassName('winner')[0];
        this.board = Array(3).fill().map(()=>Array(3).fill(''));
        this.players = [];
        this.activePlayer = null;
        this.winner = null;
        this.isGameOver = false;

        this.replayButton.addEventListener('click', this.restart.bind(this))
    }

    initPlayers(player1, player2){
        this.players = [player1, player2];
        this.activePlayer = player1;
    }

    generateBoard(){
        const nodes = [];
        for (let index = 0, len = this.board.flat().length; index < len; index++) {
            const div = document.createElement('div');
            const column = parseInt(index % 3);
            const row = parseInt(index / 3);

            div.setAttribute('class', 'item');
            div.setAttribute('data-row', row);
            div.setAttribute('data-column', column);
            div.setAttribute('data-item', index);

            div.addEventListener('click', (event) => this.clickItemHandle(event, column, row));
            div.addEventListener('mouseenter', (event) => this.mouseEnterHandle(event, column, row));
            div.addEventListener('mouseout', (event) => this.mouseLeaveHandle(event, column, row));

            nodes[index] = div;
        }
        this.main.append(...nodes);
    }

    changeActivePlayer(){
        this.activePlayer = this.activePlayer == this.players[0] ? this.players[1] : this.players[0];
    };

    updateSelectedItemClassNames(target){
        target.classList.add(`item-${this.activePlayer.symbol.toLowerCase()}`);
        target.classList.remove(`hover-item-${this.activePlayer.symbol.toLowerCase()}`);
    };

    clickItemHandle(event, column, row){
        if(this.board[row][column]){
            return;
        }

        if(this.winner){
            return;
        }
        
        const { target } = event;
        this.board[row][column] = this.activePlayer.symbol;

        this.checkWinner();
        this.updateSelectedItemClassNames(target);
        this.changeActivePlayer();
    };

    mouseEnterHandle(event, column, row){
        if(this.board[row][column]){
            return;
        }

        if(this.winner){
            return;
        }

        const { target } = event;
        target.classList.add(`hover-item-${this.activePlayer.symbol.toLowerCase()}`);
    };

    mouseLeaveHandle(event, column, row){
        if(this.board[row][column]){
            return;
        }

        if(this.winner){
            return;
        }
        
        const { target } = event;
        target.classList.remove(`hover-item-${this.activePlayer.symbol.toLowerCase()}`);
    };

    static selectRowActive(index){
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            if(item.getAttribute('data-row') == index){
                item.classList.add('item-active');
            }
        });
    }

    static selectColumnActive(index){
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            if(item.getAttribute('data-column') == index){
                item.classList.add('item-active');
            }
        });
    }

    static selectDiagonalActive(indxs){
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            for (let i = 0; i < indxs.length; i++) {
                if(item.getAttribute('data-item') == indxs[i]){
                    item.classList.add('item-active');
                }
            }
        });
    }

    setWinner(player){
        this.winner = player;
        this.isGameOver = true;
        this.winnerRef.innerHTML = player ? `The winner is: ${player.name}, symbol - ${player.symbol}` : 'Draw';

        this.main.classList.add('game-over');
    }

    setWinCombination(combination){
        this.main.setAttribute('data-win-combination', combination);
    }

    removeWinCombination(){
        this.main.removeAttribute('data-win-combination');
    }

    checkWinner(){
        for (let i = 0, len = this.board.length; i < len; i++) {
            const row = this.board[i];
            if (row.every((cell) => cell === this.activePlayer.symbol)) {
                this.setWinner(this.activePlayer);
                this.setWinCombination(`row-${i}`)
                Playground.selectRowActive(i);
                return;
            }
        }

        for (let i = 0, len = this.board.length; i < len; i++) {
            const column = this.board.map((row) => row[i]);
            if (column.every((cell) => cell === this.activePlayer.symbol)) {
                this.setWinner(this.activePlayer);
                this.setWinCombination(`column-${i}`)
                Playground.selectColumnActive(i);
                return;
            } 
        }

        const diagonal1 = [this.board[0][0], this.board[1][1], this.board[2][2]];
        const diagonal2 = [this.board[0][2], this.board[1][1], this.board[2][0]];
        
        if (diagonal1.every((cell) => cell === this.activePlayer.symbol)) {
            this.setWinner(this.activePlayer);
            this.setWinCombination(`diagonal-1`)
            Playground.selectDiagonalActive([0,4,8]);
            return;
        } else if (diagonal2.every((cell) => cell === this.activePlayer.symbol)) {
            this.setWinner(this.activePlayer);
            this.setWinCombination(`diagonal-2`)
            Playground.selectDiagonalActive([2,4,6]);
            return;
        }

        if (this.board.flat().every((cell) => cell !== "")) {
            this.setWinner(null);
            return;
        }
    }

    start(){
        this.generateBoard();
    }

    restart(){
        if(this.isGameOver){
            this.main.innerHTML = null;
            this.winnerRef.innerHTML = null;
            this.winner = null;
            this.isGameOver = false;
            this.board = Array(3).fill().map(()=>Array(3).fill(''));
    
            this.main.classList.remove('game-over');
            this.removeWinCombination();
    
            this.start();
        }

    }
}

class Player{
    constructor({symbol, name}){
        this.symbol = symbol;
        this.name = name;
    }
}

const game = new Playground();
game.initPlayers(new Player({symbol: 'X', name: 'Max'}), new Player({symbol: 'O', name: 'Olga'}));
game.start();


