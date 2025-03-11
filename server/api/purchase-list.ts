import { promises as fs } from 'fs';
import path from 'path';

let purchaseList = [
    { id: 1, text: 'Milk', completed: false },
    { id: 2, text: 'Bread', completed: true },
    { id: 3, text: 'Butter', completed: false }
];
let lastId = 3;
let initialized = false;
const dataFilePath = path.join(process.cwd(), 'data', 'purchase-list.json');

async function initializeList() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        purchaseList = JSON.parse(data);
        lastId = purchaseList.reduce(
            (max, item) => Math.max(max, item.id),
            0
        );
    } catch (err) {
        await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
        await fs.writeFile(
            dataFilePath,
            JSON.stringify(purchaseList, null, 2)
        );
    }
    initialized = true;
}

async function savePurchaseList() {
    await fs.writeFile(
        dataFilePath,
        JSON.stringify(purchaseList, null, 2)
    );
}

export default defineEventHandler(async (event) => {
    if (!initialized) {
        await initializeList();
    }
    const method = event.node.req.method;
    const url = event.node.req.url || '';

    if (method === 'GET') {
        return purchaseList;
    }

    if (method === 'POST') {
        const body = await readBody(event);
        const newItem = { id: ++lastId, text: body.text, completed: false };
        purchaseList.push(newItem);
        await savePurchaseList();
        return newItem;
    }

    if (method === 'PUT') {
        const body = await readBody(event);
        const item = purchaseList.find((i) => i.id === body.id);
        if (item) {
            item.completed = !item.completed;
            await savePurchaseList();
        }
        return item;
    }

    if (method === 'DELETE') {
        const body = await readBody(event);

        if (body && body.action === 'clear') {
            purchaseList = [];
            await savePurchaseList();
            return { success: true };
        }

        if (body && body.id) {
            purchaseList = purchaseList.filter((i) => i.id !== body.id);
            await savePurchaseList();
            return { success: true };
        }
    }
});