
class Board {
    /*
    *   Игровая доска размера n x n
    */
    constructor(n) {
        this.size = n; // размер доски
        this.data = Array(n).fill().map(() => Array(n)); // данные доски
        this.clear() // очищаем доску
    }

    clear() {
        /*
        *   Очистка доски
        */
        for (let i=0; i != this.size; i++) {
            for (let j=0; j != this.size; j++) {
                this.data[i][j] = ' ';
            }
        }
    }

    set_value(i, j, value) {
        /*
        *   Установить в пустую ячейку новое значение
        */
        if (this.data[i][j] == ' ') {
            this.data[i][j] = value;
        }
    }

    has_empty_cells() {
        /*
        *   Проверка, существуют ли пустые ячейки
        */
        for (let i=0; i != this.size; i++) {
            for (let j=0; j != this.size; j++) {
                if (this.data[i][j] == ' ')
                    return true;
            }
        }
        return false;
    }

    check_winner(w)  {
        /*
        *   Проверка того, что символ w является победителем
        */
        for (let i=0; i != this.size; i++) { // Для каждой строки
            var result = true;
            for (let j=0; j != this.size; j++) { // проверяем, что по всем ячейкам стоит w
                    result &= (this.data[i][j] == w);
            }
            if (result) return result;
        }
    
        for (let j=0; j != this.size; j++) { // Для каждого столбца
            result = true;
            for (let i=0; i != this.size; i++) { // проверяем, что по всем ячейкам стоит w
                    result &= (this.data[i][j] == w);
            }
            if (result) return result;
        }
    
        // Проверяем одну диагональ
        result = true;
        for (let i=0; i != this.size; i++) {
                result &= (this.data[i][i] == w);
        }
        if (result) return result;
    
        // Проверяем другую диагональ
        result = true;
        for (let i=0; i != this.size; i++) {
            result &= (this.data[i][this.size-1-i] == w)
        }
        if (result) return result;
    
        // Символ w не выиграл.
        return false;
    
    }

    winner() {
        /*
        *   Возвращает текущую ситуацию на доске 
        *   X -- выиграли крестики
        *   O -- выиграли нолики
        *   D -- ничья 
        *   ? -- пока никто не выиграл
        */
        for (let w of ['X', 'O']) { // Проверяем, выиграли крестики или нолики
            if (this.check_winner(w)) {
                return w;
            }
        }

        if (!this.has_empty_cells()) { // Если нет пустых ячеек,
            return 'D'; // то ничья
        }

        return '?'; // пока никто не выиграл
    }


}


class Ai_player {
    /*
    *    "Искусственный" интеллект (AI).
    *    Играет очень тупенько. Просто выбирает свободную ячейку,
    *    и ставит туда нолик
    */

    move(board) {
        /*
        *   Ход AI
        *   board -- игровая доска
        */
        
        // Сформируем массив свободных ячеек
        var free_cells = [] 
        for (let i = 0; i != board.size; i++) {
            for (let j = 0; j != board.size; j++) {
                if (board.data[i][j] == ' ') {
                    free_cells.push([i, j])
                }
            }
        }

        // Выберем случайный элемент
        return free_cells[Math.floor(Math.random() * free_cells.length)];
    }
}    

export class Ttt_game {
    constructor(n) {
        this.board = new Board(n);
        this.ai_player = new Ai_player();
        this.player_score = 0;
        this.ai_player_score = 0;
    }

    new_round() {
        // Новый раунд. Надо очистить доску
        this.board.clear();
    }
    
    move(i, j) { 
        /*
        * Ход игры. 
        * (i, j) -- клетка, куда пошел игрок
        */

        this.board.set_value(i, j, 'X'); // Делаем ход игрока
        let winner = this.board.winner(); // Проверяем ситуацию на доске

        if (winner == 'D') { // Если ничья
            //this.new_round(); // то запускаем новый раунд
            return 'D'; // и сообщаем, что ничья
        }
        
        if (winner == 'X') { // Если выиграли крестики
            this.player_score += 1; // то увеличиваем счет игрока,
            //this.new_round(); // запускаем новый раунд 
            return 'X'; // сообщаем, выиграли крестики
        }
        
        // В данный момент нет выигрыша крестиков или ничьи
            
        [i, j] = this.ai_player.move(this.board);  // Значит ход может сделать AI
        this.board.set_value(i, j, 'O');
        winner = this.board.winner(); // Проверяем ситуацию на доске
        if (winner == 'O') { // Если выиграли нолики 
            this.ai_player_score += 1; // то увеличиваем счет AI,
            //this.new_round() // запускаем новый раунд 
            return 'O'; // сообщаем, выиграли нолики 
        }

        // Никто не выиграл. Можно делать следующий ход.
        return '?';
    }
}


