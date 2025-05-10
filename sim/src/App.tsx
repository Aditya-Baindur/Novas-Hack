import * as React from 'react'
import { useSpring, to, animated, config } from '@react-spring/web'
import styles from './styles.module.css'

// Box dimensions
const BOX_WIDTH = 500; // Box width
const BOX_HEIGHT = 600; // Box height
const WALL_THICKNESS = 20;
const LINE_THICKNESS = WALL_THICKNESS;
const LINE_HEIGHT = BOX_HEIGHT - 100;
const LINE_X_POSITION = BOX_WIDTH * 0.6;

// Predefined paths for the rocket
const predefinedPaths = {
  rightExit: [
    [BOX_WIDTH / 2, BOX_HEIGHT - 50], // Start
    [BOX_WIDTH - 50, BOX_HEIGHT - 50], // Move right
    [BOX_WIDTH - 50, BOX_HEIGHT / 2], // Move up
    [BOX_WIDTH - 50, BOX_HEIGHT + 100] // Exit
  ] as [number, number][],
  
  leftExit: [
    [BOX_WIDTH / 2, BOX_HEIGHT - 50], // Start
    [50, BOX_HEIGHT - 50], // Move left
    [50, BOX_HEIGHT / 2], // Move up
    [50, BOX_HEIGHT + 100] // Exit
  ] as [number, number][],
  
  middleExit: [
    [BOX_WIDTH / 2, BOX_HEIGHT - 50], // Start
    [BOX_WIDTH / 2, BOX_HEIGHT / 2 + 50], // Move up
    [BOX_WIDTH / 2, BOX_HEIGHT / 2 + 50], // Move up
    [BOX_WIDTH / 2, BOX_HEIGHT + 100] // Exit
  ] as [number, number][]
}

export default function App() {
  const [currentPath, setCurrentPath] = React.useState('rightExit');
  const [pathIndex, setPathIndex] = React.useState(0);
  const [{ pos }, api] = useSpring(() => ({ 
    pos: predefinedPaths.rightExit[0] as [number, number] 
  }));
  const [{ angle }, angleApi] = useSpring(() => ({
    angle: 0,
    config: config.wobbly,
  }));

  const [collectedSquares, setCollectedSquares] = React.useState<number[]>([]);

  React.useEffect(() => {
    const path = predefinedPaths[currentPath as keyof typeof predefinedPaths];
    setPathIndex(0);
    api.start({
      pos: path[0],
      immediate: true
    });
  }, [currentPath]);

  React.useEffect(() => {
    const path = predefinedPaths[currentPath as keyof typeof predefinedPaths];
    
    if (pathIndex >= path.length - 1) return;
    
    const timeout = setTimeout(() => {
      const nextIndex = pathIndex + 1;
      
      const currentPos = path[pathIndex];
      const nextPos = path[nextIndex];
      
      const direction = [nextPos[0] - currentPos[0], nextPos[1] - currentPos[1]];
      const distance = Math.sqrt(direction[0] ** 2 + direction[1] ** 2);
      
      if (distance > 0) {
        const normalizedDir = [direction[0] / distance, direction[1] / distance];
        angleApi.start({ angle: Math.atan2(normalizedDir[0], -normalizedDir[1]) });
      }
      
      api.start({
        pos: nextPos,
        config: { tension: 120, friction: 14 }
      });
      
      // Check for square collection
      if (nextPos[0] === 50 && nextPos[1] === BOX_HEIGHT / 2) {
        setCollectedSquares(prev => [...prev, 1]); // Collect a square
      }
      
      if (nextPos[0] === BOX_WIDTH - 50 && nextPos[1] === BOX_HEIGHT / 2) {
        setCollectedSquares(prev => [...prev, 2]); // Collect another square
      }
      
      setPathIndex(nextIndex);
    }, 500); // Fast collection animation
    
    return () => clearTimeout(timeout);
  }, [pathIndex, currentPath]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {/* Left wall */}
        <div 
          className={styles.wall} 
          style={{ 
            left: 0, 
            top: 0, 
            width: WALL_THICKNESS, 
            height: BOX_HEIGHT 
          }} 
        />
        
        {/* Right wall */}
        <div 
          className={styles.wall} 
          style={{ 
            right: 0, 
            top: 0, 
            width: WALL_THICKNESS, 
            height: BOX_HEIGHT 
          }} 
        />
        
        {/* Top wall */}
        <div 
          className={styles.wall} 
          style={{ 
            left: 0, 
            top: 0, 
            width: BOX_WIDTH, 
            height: WALL_THICKNESS 
          }} 
        />
        
        {/* Middle line */}
        <div 
          className={styles.wall} 
          style={{ 
            left: LINE_X_POSITION, 
            top: WALL_THICKNESS, 
            width: LINE_THICKNESS, 
            height: LINE_HEIGHT 
          }} 
        />
        
        {/* Red and Green Squares */}
        <div className={styles.redSquare} style={{ left: BOX_WIDTH - 70, top: BOX_HEIGHT / 2 }} />
        <div className={styles.redSquare} style={{ left: 30, top: BOX_HEIGHT / 2 }} />
        <div className={styles.greenSquare} style={{ left: BOX_WIDTH / 2 - 10, top: 50 }} />
        
        {/* Rocket */}
        <animated.div
          className={styles.rocket}
          style={{
            transform: to(
              [pos, angle],
              (posVal: [number, number], a: number) => 
                `translate3d(${posVal[0] - 50}px,${posVal[1] - 50}px,0) rotate(${a}rad)`
            ),
          }}
        >
          {/* Display collected squares on the rocket */}
          {collectedSquares.length > 0 && (
            <div className={styles.collectedSquares}>
              {collectedSquares.map((_, index) => (
                <div key={index} className={styles.redSquare} />
              ))}
            </div>
          )}
        </animated.div>
      </div>
      
      <div className={styles.controls}>
        <button onClick={() => setCurrentPath('rightExit')}>Right Exit</button>
        <button onClick={() => setCurrentPath('middleExit')}>Middle Exit</button>
        <button onClick={() => setCurrentPath('leftExit')}>Left Exit</button>
      </div>
    </div>
  );
}