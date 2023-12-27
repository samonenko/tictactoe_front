import {Ttt_game} from './tictactoe.js';

// Технический вызов, чтобы можно было считывать данные в консоли
import promptSync from 'prompt-sync';
const prompt = promptSync();


class Console_game {
    /*
        Реализация игры в консоли.
        После запуска печатается счет и текущее поле игры. 
        Пустые ячейки пронумерованы числами от 1 до n*n. 
        Игроку предлагается ввести номер ячейки или нажать Q для выхода.
    */

    constructor(n) {
        this.ttt_game = new Ttt_game(n);
    }

    play() {
        /* 
        * Запуск игры
        */ 
        while (true) {
        // Бесконечный цикл игры

            this.print_board() // Печатаем доску 
            const input_value = prompt('Ваш ход:'); // Получаем символ от пользователя 
            if (input_value == 'Q') { // Завершение игры
                console.log(message['Q']);
                return 
            }
            // Получаем координаты ячейки
            let cell_num = parseInt(input_value) - 1
            let n = this.ttt_game.board.size;
            let i = Math.floor(cell_num / n)
            let j = cell_num % n

            // Делаем ход игры и получаем его результат 
            let result = this.ttt_game.move(i, j)
            if (result != '?') {
                this.print_board();
                this.ttt_game.new_round();
                let message = {
                    'X': "Вы выиграли",
                    'O': "Вы проиграли",
                    'D': "Ничья",
                }
                console.log(message[result]);
                console.log("Счет " + this.ttt_game.player_score + ":" + this.ttt_game.ai_player_score) // Печатаем счет
                console.log('\n');
            }
        }
    } 
    
    print_board(){
        /*
        *    Печать доски в консоль c номерами клеток
        */
        
        let counter = 1
        for (let i=0; i != this.ttt_game.board.size; i++) {
            var string = '|'
            for (let j=0; j != this.ttt_game.board.size; j++) {
                if (this.ttt_game.board.data[i][j] == ' ') {
                    string += counter + '|';
                } else {
                    string += this.ttt_game.board.data[i][j] + '|';
                }
                counter += 1
            }
            console.log(string);
        }
    }    
}

let game = new Console_game(3);
game.play();