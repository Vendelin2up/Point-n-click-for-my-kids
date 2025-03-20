type NurseryProps = {
  setCurrentRoom: (room: 'hall' | 'livingroom' | 'nursery') => void;
  setHasKeyPart2: (hasKey: boolean) => void;
  hasKeyPart2: boolean;
};

const Nursery = ({ setCurrentRoom, setHasKeyPart2, hasKeyPart2 }: NurseryProps) => {
  return (
    <div>
      <h1>Barnkammaren</h1>
      <button onClick={() => setCurrentRoom('livingroom')}>Gå tillbaka till Vardagsrummet</button>
      
      {!hasKeyPart2 && (
        <button onClick={() => setHasKeyPart2(true)}>Plocka upp nyckeldel 2</button>
      )}
    </div>
  );
};

export default Nursery;
