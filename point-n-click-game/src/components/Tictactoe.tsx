import { useState } from "react";

type TicTacToeProps = {
  onWin: () => void;
};

const TicTacToe = ({ onWin }: TicTacToeProps) => {
  const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);

  const checkWinner = (squares: ("X" | "O" | null)[]): "X" | "O" | null => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const makeAIMove = (newBoard: ("X" | "O" | null)[]) => {
    const emptyIndices = newBoard.map((v, i) => (v === null ? i : null)).filter((v): v is number => v !== null);
    if (emptyIndices.length > 0) {
      const aiMove = emptyIndices[0]; // AI tar första lediga plats
      newBoard[aiMove] = "O";
      setBoard([...newBoard]);
      setIsXNext(true);
      const newWinner = checkWinner(newBoard);
      if (newWinner) setWinner(newWinner);
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setTimeout(() => onWin(), 500);
      return;
    }

    // AI gör sitt drag efter 500ms
    setTimeout(() => {
      if (!checkWinner(newBoard)) {
        makeAIMove(newBoard);
      }
    }, 500);
  };

  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h3 style={{ marginBottom: "20px", fontSize: "24px" }}>Tic-Tac-Toe</h3>
      {winner && <h4 style={{ color: "green" }}>{winner} har vunnit!</h4>}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: "5px",
        backgroundColor: "#000",
        padding: "10px",
        borderRadius: "10px"
      }}>
        {board.map((value, index) => (
          <button
            key={index}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "36px",
              textAlign: "center",
              backgroundColor: "#fff",
              border: "2px solid black",
              cursor: "pointer"
            }}
            onClick={() => handleClick(index)}
            disabled={winner !== null}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
