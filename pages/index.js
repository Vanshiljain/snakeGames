import { useState, useEffect } from 'react';

const SnakeGame = () => {
  const canvasWidth = 400;
  const canvasHeight = 400;
  const scale = 20;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [food, setFood] = useState(getRandomFoodPosition);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
        if (head.x < 0 || head.x >= canvasWidth / scale || head.y < 0 || head.y >= canvasHeight / scale) {
          setGameOver(true);
          return prevSnake;
        }
        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFoodPosition);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const getRandomFoodPosition = () => {
    const x = Math.floor(Math.random() * (canvasWidth / scale));
    const y = Math.floor(Math.random() * (canvasHeight / scale));
    return { x, y };
  };

  return (
    <div>
      <h1>Snake Game</h1>
      <canvas
        style={{ border: '1px solid black' }}
        width={canvasWidth}
        height={canvasHeight}
        ref={(canvas) => {
          if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = 'green';
            snake.forEach(({ x, y }) => {
              ctx.fillRect(x * scale, y * scale, scale, scale);
            });
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
          }
        }}
      />
      {gameOver && <h2>Game Over</h2>}
    </div>
  );
};

export default SnakeGame;