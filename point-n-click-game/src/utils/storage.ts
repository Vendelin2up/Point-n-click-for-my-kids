export const saveToStorage = (key: string, value: boolean) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  export const loadFromStorage = (key: string): boolean => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : false;
  };