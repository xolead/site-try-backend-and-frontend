async function getProducts() {
  const responce = await fetch('/api/product', {
    method: 'GET',
  });
  const result = await responce.json();
  return result;
}

async function getProduct(id) {
  const responce = await fetch('/api/product/' + id, {
    method: 'GET',
  });
  const result = await responce.json();
  return result;
}
