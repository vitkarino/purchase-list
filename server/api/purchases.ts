import { purchases } from '../data/purchaseData';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url || '';
  
  // GET /api/purchases - Get all items
  if (method === "GET" && !url.includes("/purchases/")) {
    return purchases;
  }
  
  // POST /api/purchases/add - Add new item
  if (method === "POST" && url.endsWith("/add")) {
    const body = await readBody(event);
    const newItem = { id: Date.now(), text: body.text, completed: false };
    purchases.push(newItem);
    return newItem;
  }
  
  // POST /api/purchases/clear - Clear all items
  if (method === "POST" && url.endsWith("/clear")) {
    purchases.length = 0;
    return { success: true };
  }
  
  // Operations with specific IDs
  const idMatch = url.match(/\/purchases\/(\d+)/);
  if (idMatch) {
    const id = parseInt(idMatch[1]);
    
    // DELETE /api/purchases/123 - Delete an item
    if (method === "DELETE") {
      const index = purchases.findIndex(item => item.id === id);
      if (index !== -1) {
        const deleted = purchases.splice(index, 1)[0];
        return { success: true, deleted };
      }
      return { success: false, error: "Item not found" };
    }
    
    // PATCH /api/purchases/123 - Toggle completion
    if (method === "PATCH") {
      const item = purchases.find(item => item.id === id);
      if (item) {
        item.completed = !item.completed;
        return { success: true, item };
      }
      return { success: false, error: "Item not found" };
    }
  }
  
  return { error: "Method not allowed or resource not found" };
});