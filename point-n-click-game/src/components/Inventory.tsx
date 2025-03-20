import { loadFromStorage } from "../utils/storage";

const Inventory = () => {
  const hasKeyPart1: boolean = loadFromStorage("keyPart1");
  const hasKeyPart2: boolean = loadFromStorage("keyPart2");

  return (
    <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0, 0, 0, 0.7)", padding: "10px", borderRadius: "10px", color: "white" }}>
      <h3>Inventarie</h3>
      <ul>
        {hasKeyPart1 && <li>🗝️ Nyckeldel 1</li>}
        {hasKeyPart2 && <li>🗝️ Nyckeldel 2</li>}
        {!hasKeyPart1 && !hasKeyPart2 && <li>Tomt...</li>}
      </ul>
    </div>
  );
};

export default Inventory