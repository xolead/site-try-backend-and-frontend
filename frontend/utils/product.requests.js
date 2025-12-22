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

async function createProduct(name, description, price, quantity, img) {
  await fetch('/api/product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      description: description,
      price: price,
      quantity: quantity,
      img: img,
    }),
  });
}

async function deleteProduct(id) {
  await fetch('/api/product/' + id, {
    method: 'DELETE',
  });
}

async function updateProduct(id, name, description, price, quantity, img) {
  await fetch('/api/product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: id,
      name: name,
      description: description,
      price: price,
      quantity: quantity,
      img: img,
    }),
  });
}

export { createProduct, getProduct, getProducts, deleteProduct, updateProduct };
