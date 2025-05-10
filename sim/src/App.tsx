import * as React from 'react'
import { useSpring, to, animated, config } from '@react-spring/web'

import styles from './styles.module.css'

// Box dimensions
const BOX_WIDTH = 400;
const BOX_HEIGHT = 500;
const WALL_THICKNESS = 20;
const LINE_THICKNESS = WALL_THICKNESS;
const LINE_HEIGHT = BOX_HEIGHT - 100;
const LINE_X_POSITION = BOX_WIDTH * 0.6;

// Predefined paths for the rocket
const predefinedPaths = {
  leftExit: [
    // Start at center bottom
    [BOX_WIDTH / 2, BOX_HEIGHT - 50],
    // Go up
    [BOX_WIDTH / 2, BOX_HEIGHT / 2],
    // Go to left side
    [BOX_WIDTH / 4, BOX_HEIGHT / 2],
    // Go down and exit
    [BOX_WIDTH / 4, BOX_HEIGHT + 100]
  ] as [number, number][],

  rightTurn: [
    // Start at center bottom
    [BOX_WIDTH / 2, BOX_HEIGHT - 50],
    // Go up
    [BOX_WIDTH / 2, BOX_HEIGHT / 2],
    // Go to right (between wall and line)
    [LINE_X_POSITION + (BOX_WIDTH - LINE_X_POSITION) / 2, BOX_HEIGHT / 2],
    // Go more up
    [LINE_X_POSITION + (BOX_WIDTH - LINE_X_POSITION) / 2, BOX_HEIGHT / 4],
    // Turn back
    [BOX_WIDTH / 2, BOX_HEIGHT / 3],
    // Exit
    [BOX_WIDTH / 2, BOX_HEIGHT + 100]
  ] as [number, number][],

  lineLeft: [
    // Start at center bottom
    [BOX_WIDTH / 2, BOX_HEIGHT - 50],
    // Go up
    [BOX_WIDTH / 2, BOX_HEIGHT / 2],
    // Go to left of line
    [LINE_X_POSITION - LINE_THICKNESS - 50, BOX_HEIGHT / 2],
    // Go to top (inside box)
    [LINE_X_POSITION - LINE_THICKNESS - 50, WALL_THICKNESS + 50],
    // Turn back
    [BOX_WIDTH / 3, BOX_HEIGHT / 3],
    // Exit
    [BOX_WIDTH / 3, BOX_HEIGHT + 100]
  ] as [number, number][]
}

export default function App() {
  const [currentPath, setCurrentPath] = React.useState('leftExit');
  const [pathIndex, setPathIndex] = React.useState(0);
  const [{ pos }, api] = useSpring(() => ({ 
    pos: predefinedPaths.leftExit[0] as [number, number] 
  }));
  const [{ angle }, angleApi] = useSpring(() => ({
    angle: 0,
    config: config.wobbly,
  }));

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
    
    // Don't proceed if we've reached the end of the path
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
      
      setPathIndex(nextIndex);
    }, 1000);
    
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
        
        {/* Rocket */}
        <animated.div
          className={styles.rocket}
          style={{
            transform: to(
              [pos, angle],
              (posVal: [number, number], a: number) => 
                `translate3d(${posVal[0] - 70}px,${posVal[1] - 70}px,0) rotate(${a}rad)`
            ),
          }}
        />
      </div>
      
      <div className={styles.controls}>
        <button onClick={() => setCurrentPath('leftExit')}>Left Exit</button>
        <button onClick={() => setCurrentPath('rightTurn')}>Right Turn</button>
        <button onClick={() => setCurrentPath('lineLeft')}>Line Left</button>
      </div>
    </div>
  );
}