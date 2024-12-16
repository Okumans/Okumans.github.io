import { useRef, useEffect, useState, useCallback } from "react";

interface AsciiCanvasProps {
  fontSize: number;
  spawnRate: number;
  speedRange: [number, number];
}

interface FallingCharacter {
  char: string;
  col: number;
  row: number;
  y: number;
  speed: number;
  color: string;
}

function randomCharacter(): string {
  const ranges = [
    { start: 33, end: 126, weight: 0.4 }, // ASCII printable characters
    { start: 0x0e01, end: 0x0e2f, weight: 0.3 }, // Thai characters
    { start: 0x3041, end: 0x306f, weight: 0.2 }, // Hiragana
    { start: 0x30a0, end: 0x30ff, weight: 0.1 }, // Katakana
  ];

  // Compute cumulative weights
  const cumulativeWeights = ranges.map((_, i, arr) =>
    arr.slice(0, i + 1).reduce((sum, r) => sum + r.weight, 0),
  );
  const totalWeight = cumulativeWeights[cumulativeWeights.length - 1];

  // Generate a random number and find the corresponding range
  const random = Math.random() * totalWeight;
  const selectedRange =
    ranges[cumulativeWeights.findIndex((cumulative) => random <= cumulative)];

  // Generate a character from the selected range
  return String.fromCharCode(
    Math.floor(Math.random() * (selectedRange.end - selectedRange.start + 1)) +
      selectedRange.start,
  );
}

function createNewCharacter(
  cols: number,
  speedRange: [number, number],
  colPosition: number = -1,
): FallingCharacter {
  const col =
    colPosition === -1 ? Math.floor(Math.random() * cols) : colPosition;
  return {
    char: randomCharacter(),
    col,
    row: 0,
    y: 0,
    speed: speedRange[0] + Math.random() * speedRange[1],
    color: generateBrightColor(),
  };
}

function generateBrightColor(): string {
  const baseHue = Math.random() * 360;
  const saturation = Math.random() * 100; // 80-100%
  const lightness = 50 + Math.random() * 20; // 50-70%
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
}

export function AsciiCanvas({
  fontSize,
  spawnRate,
  speedRange,
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [fallingCharacters, setFallingCharacters] = useState<
    FallingCharacter[]
  >([]);

  const cellSize = fontSize + 4;

  const spawnMultipleCharacters = useCallback(
    (count: number, atPosition: number = -1) => {
      const newCharacters = Array.from({ length: count }, () =>
        createNewCharacter(cols, speedRange, atPosition),
      );
      setFallingCharacters((prev) => [...prev, ...newCharacters]);
    },
    [cols],
  );

  const updateAndRender = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update falling characters
      setFallingCharacters((prev) => {
        return prev
          .map((char) => {
            const newY = char.y + char.speed * deltaTime * 0.1;
            return {
              ...char,
              y: newY,
              row: Math.floor(newY / cellSize),
            };
          })
          .filter((char) => char.row < rows);
      });

      // Render characters
      ctx.font = `700 ${cellSize - 4}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw falling characters with fade effect
      fallingCharacters.forEach((char) => {
        const alpha = Math.max(0, 1 - char.y / (canvas.height * 0.8));
        ctx.fillStyle = char.color
          .replace(")", `, ${alpha})`)
          .replace("hsl", "hsla");
        ctx.fillText(
          char.char,
          char.col * cellSize + cellSize / 2,
          char.y + cellSize / 2,
        );
      });

      animationFrameRef.current = requestAnimationFrame(updateAndRender);
    },
    [cellSize, cols, rows, fallingCharacters],
  );

  // Set up animation loop
  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateAndRender);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateAndRender]);

  // Spawn new characters periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const spawnCount = 1 + Math.floor(Math.random() * spawnRate); // Spawn 1-7 characters
      spawnMultipleCharacters(spawnCount);
    }, 500);

    return () => clearInterval(spawnInterval);
  }, [spawnMultipleCharacters]);

  // Handle window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      const newCols = Math.floor(containerWidth / cellSize);
      const newRows = Math.floor(containerHeight / cellSize);

      setCols(newCols);
      setRows(newRows);

      canvas.width = newCols * cellSize;
      canvas.height = newRows * cellSize;
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: "#0A0A0A",
        cursor: "pointer",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
