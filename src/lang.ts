export function intersection<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
    return arr1.filter((key) => {
      return arr2.includes(key);
    });
  }
  