import {Ttt_game} from './tictactoe.js';

class Browser_game {
    /*
    * Игра в крестики-нолики в браузере 
    */

    constructor(n, canvas, text) {
    /*
    *   Конструктор
    *   n -- размер доски
    *   canvas -- элемент холст 
    *   text -- элемент текст для информации
    */
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.text = text;
        this.ttt_game = new Ttt_game(n);
        this.cell_size = Math.floor(this.canvas.width / n);
        
        // Объект может находится в двух состояниях:
        // -- игра продолжается -- true 
        // -- игра завершена (ожидание нового раунда) -- false
        // Необходимо для того, чтобы показать игроку итоговую конфигурацию.
        // Новый раунд будет после клика на доску.
        this.play = true;
        
        this.draw(); // Рисуем поле 
        this.set_text(""); // Очищаем информационное поле

        // Конструкция, необходимая для обработки отклика на клик.
        // Сделана через this.handleEvent для того, чтобы можно было удалять 
        // обработку клика при смене размера доски.
        // Подробнее тут: https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener
        this.handleEvent = function (event) {
            this.player_click(event);  
        }
        // Если произошел click на холст, то вызывается this.handleEvent
        this.canvas.addEventListener('click',  this); 
    }

    deleteListener() {
        /*
        * Удаление обработки клика холста.
        * Необходимо только в случае смены размера доски, т.к. если не удалять,
        * то при смене размера клик будет обрабатываться дважды.
        */
        this.canvas.removeEventListener('click',  this);
    }

    draw() {
        /*
        * Отрисовка поля
        */
        // Заполняем белым цветом
        this.context.fillStyle = "#ffffff";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        let n = this.ttt_game.board.size; // Размер доски 
        for (let i=0; i != n+1; i++) {
            // Рисуем вертикальные линии
            this.context.beginPath();
            this.context.moveTo(0,this.cell_size*i);
            this.context.lineTo(this.cell_size*n, this.cell_size*i);
            this.context.stroke();

            // Рисуем горизонтальные линии
            this.context.beginPath();
            this.context.moveTo(this.cell_size*i, 0);
            this.context.lineTo(this.cell_size*i, this.cell_size*n);
            this.context.stroke();
        }
        
        // Рисуем символы
        for (let i=0; i != n; i++) {
            for (let j=0; j != n; j++) {
                if (this.ttt_game.board.data[i][j] == 'X') {
                    // Отрисовка крестика
                    this.context.beginPath()
                    this.context.moveTo(i*this.cell_size,j*this.cell_size);
                    this.context.lineTo((i+1)*this.cell_size, (j+1)*this.cell_size);
                    this.context.stroke();
                    this.context.beginPath()
                    this.context.moveTo(i*this.cell_size,(j+1)*this.cell_size);
                    this.context.lineTo((i+1)*this.cell_size, j*this.cell_size);
                    this.context.stroke();
                } else if (this.ttt_game.board.data[i][j] == 'O') {
                    // Отрисовка нолика
                    this.context.beginPath()
                    this.context.arc((i+0.5)*this.cell_size, (j+0.5)*this.cell_size, this.cell_size/2, 0, 2 * Math.PI);
                    this.context.stroke();
                }
            }
        }  
    };

    set_text(text) {
        /*
        *   Заполнение текстом области для информационных сообщений
        *   text -- текст для заполнения
        */
        this.text.innerHTML = text;
    }
    player_click(event) {
        /*
        *   Обработка клика игрока
        *   event -- событие клика
        */
        
        if (this.play) { // Если игра продолжается
            
            //  Узнаем ячейку, куда кликнул игрок
            let i = Math.floor(event.offsetX / this.cell_size);
            let j = Math.floor(event.offsetY / this.cell_size);
            
            //  Делаем ход игры и узнаем результат
            let result = this.ttt_game.move(i, j); 
            
            // Рисуем текущую конфигурацию
            this.draw();

            if (result != "?") { // Если после нового игра завершена

                
                let message = {
                    'X': "Вы выиграли",
                    'O': "Вы проиграли",
                    'D': "Ничья",
                }
                let score_text = "Счет " + this.ttt_game.player_score + ":" + this.ttt_game.ai_player_score
                let text = message[result] + "<br>" + score_text;
                
                // Обновляем сообщение в информационном поле
                this.set_text(text);
                
                // Переводим объект в статус игра завершена, т.е. будем ждать еще одного клика
                this.play = false;
            }
        } else { // Если игра была завершена и произошел новый клик
            
            this.ttt_game.new_round(); // Делаем новый раунд
            this.draw(); // Рисуем доску
            this.set_text(""); // Очищаем текст 
            this.play = true; // Переводим объект в режим игры 

        }
    }
}

var game; // Глобальный объект игры 
const canvas = document.getElementById('canvas'); // Получаем элемент холст по идентификатору
const text = document.getElementById('info_text'); // Получаем элемент текст по идентификатору

window.addEventListener("load", (event) => { // Когда страница загрузилась
    let n = parseInt(document.getElementById('board_size').value); // Читаем размер игры
    game = new Browser_game(n, canvas, text); // Запускаем новую игру
});

document.getElementById('new_game').addEventListener('click', (event) => { // Когда нажали на Новую игру
    let n = parseInt(document.getElementById('board_size').value); // Читаем размер игры
    game.deleteListener(); // Удаляем старый обработчик клика на холст
    game = new Browser_game(n, canvas, text); // Запускаем новую игру
});


