let coinsData = [];

fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(response.status);
    return response.json();
  })
  .then(data => {
    coinsData = data.map(coin => ({
        name: coin.name,
        id: coin.id,
        image: coin.image,
        symbol: coin.symbol,
        current_price: coin.current_price,
        total_volume: coin.total_volume,
        market_cap: coin.market_cap,
      }));
    renderTable(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

async function fetchData() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      renderTable(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  fetchData();
  
  function renderTable(data) {
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = '';
  
    data.forEach(coin => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${coin.image}" alt="${coin.name}" width="20" height="20"></td>
        <td>${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td><span>$</span>${coin.current_price}</td>
        <td><span>$</span>${coin.total_volume.toLocaleString()}</td>
        <td style="color:green;">${coin.price_change_percentage_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
        <td><span>Mkt Cap:$</span>${coin.market_cap.toLocaleString()}</td>

      `;
      tableBody.appendChild(row);
    });
  }
  
  // for searching while typing
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', search);

  function search() {
  
    const searchValue = searchInput.value.toLowerCase();

    const rows = document.querySelectorAll('#coinTableBody tr');
  
    rows.forEach(row => {
      const name = row.cells[0].innerText.toLowerCase();
      const symbol = row.cells[1].innerText.toLowerCase();
  
      if (name.includes(searchValue) || symbol.includes(searchValue)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
  

  //for sorting data
  function sortData(sortKey) {
    const table = document.getElementById('coinTableBody');
    const rows = Array.from(table.querySelectorAll('tr'));
    console.log(rows[6]);
    rows.sort((a, b) => {
        const aValue = parseFloat(a.cells[sortKey === 'marketCap' ? 6 : 5].innerText.replace(/[$,%]/g, ''));
        const bValue = parseFloat(b.cells[sortKey === 'marketCap' ? 6 : 5].innerText.replace(/[$,%]/g, ''));
    
        return sortKey === 'marketCap' ? bValue - aValue : aValue - bValue;
    
    });
    console.log(rows[6]);
    rows.forEach(row => table.removeChild(row));
    rows.forEach(row => table.appendChild(row));

  }