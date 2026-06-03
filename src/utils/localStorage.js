export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      alert('O armazenamento local está cheio. Remova algumas imagens ou entre em contato com o suporte.');
    } else {
      console.error('Erro ao salvar no localStorage:', e);
    }
    return false;
  }
}

export function loadFromLocalStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}
