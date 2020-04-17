(function () {
  const formattedCurrency = value => new Intl.NumberFormat('en-US', {
    currency: 'usd',
    style: 'currency'
  }).format(value)

  const formattedDate = value => new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value))

  document.querySelectorAll('.price').forEach(node => node.textContent = formattedCurrency(node.textContent))

  document.querySelectorAll('.date').forEach(node => node.textContent = formattedDate(node.textContent))

  const $cart = document.querySelector('#cart')
  if ($cart) {
    $cart.addEventListener('click', event => {
      if (event.target.classList.contains('js-remove')) {
        const id = event.target.dataset.id
        const csrf = event.target.dataset.csrf

        fetch(`/cart/remove/${id}`, { method: 'DELETE', headers: { 'X-XSRF-TOKEN': csrf } })
          .then(response => response.json())
          .then(cart => {
            if (cart.programs.length > 0) {
              const html = cart.programs.map(p => {
                return `
                  <tr>
                    <td>${p.title}</td>
                    <td>${p.count}</td>
                    <td>
                      <button class="btn btn-small red js-remove" data-id="${p._id}">Remove</button>
                    </td>
                  </tr>
                `
              }).join('')
              $cart.querySelector('tbody').innerHTML = html
              $cart.querySelector('.price').textContent = formattedCurrency(cart.total)
            } else {
              $cart.innerHTML = `<p class="center">Cart is empty</p>`
            }
          })
      }
    })
  }

  M.Tabs.init(document.querySelectorAll('.tabs'))
})()
