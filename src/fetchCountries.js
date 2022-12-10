export const fetchCountries = name => {   //забираємо дані по лінку API, робимо іменований експорт
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=,name,capital,population,flags,languages`
    ) // фільтруємо вивід запиту та включаємо тільки потрібні дані (назва,столиця,населення,прапор,мова)
      .then(response => {
      if (!response.ok) {  // ідентифікуємо помилки
        if (response.status === 404) {
          return [];        // якщо респонс не успішний через помилку 404, тоді виходимо з перевірки і йдемо далі повертати json
        }
        throw new Error(response.status); // при іншій помилці фіксуємо статус респонса
      }
      return response.json(); // успішно повертаємо json з даними
    })
    .catch(error => {
      console.error(error);  // ловимо помилку в лог
    });
};