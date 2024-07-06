export default function ChangeObjectKeyPosition(obj, key, newIndex) {
    if (obj === undefined || obj === null) {
      return obj;
    }
    const entries = Object.entries(obj);
    entries.splice(newIndex, 0, [key, obj[key]]);
    const result = Object.fromEntries(entries);
    return result;
  }