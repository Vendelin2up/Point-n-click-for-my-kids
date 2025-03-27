import { useState } from 'react';
import Hall from './components/Hall';
import LivingRoom from './components/Vardagsrummet';
import Nursery from './components/Barnkammaren';
import NurseryPartTwo from './components/Barnkammaren-parttwo';

import './App.css';

function App() {
  const [currentRoom, setCurrentRoom] = useState<'hall' | 'livingroom' | 'nursery' | 'nursery-part2'>('hall');
  const [hasKeyPart1, setHasKeyPart1] = useState(false);
  const [hasKeyPart2, setHasKeyPart2] = useState(false);

  return (
    <>
      <div>
        {currentRoom === 'hall' && <Hall setCurrentRoom={setCurrentRoom} />}
        {currentRoom === 'livingroom' && (
          <LivingRoom 
            setCurrentRoom={setCurrentRoom} 
            setHasKeyPart1={setHasKeyPart1} 
            hasKeyPart1={hasKeyPart1} 
          />
        )}
        {currentRoom === 'nursery' && (
          <Nursery 
            setCurrentRoom={setCurrentRoom} 
            setHasKeyPart2={setHasKeyPart2} 
            hasKeyPart2={hasKeyPart2} 
          />
        )}

        {currentRoom === 'nursery-part2' && (
          <NurseryPartTwo 
            setCurrentRoom={setCurrentRoom}
          />
        )}

      </div>
    </>
  );
}

export default App;
