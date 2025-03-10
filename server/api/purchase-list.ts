let purchaseList = [
  { id: 1, text: 'Milk', completed: false },
  { id: 2, text: 'Bread', completed: true },
  { id: 3, text: 'Meat', completed: false }
];

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    return purchaseList;
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const newItem = { id: Date.now(), text: body.text, completed: false };
    purchaseList.push(newItem);
    return newItem;
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    const item = purchaseList.find((i) => i.id === body.id);
    if (item) item.completed = !item.completed;
    return item;
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    purchaseList = purchaseList.filter((i) => i.id !== body.id);
    return { success: true };
  }

  if (method === 'DELETE' && event.node.req.url?.includes('clear')) {
    purchaseList = [];
    return { success: true };
  }
});
