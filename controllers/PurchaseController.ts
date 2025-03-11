import { reactive, ref } from 'vue';
import { PurchaseItem } from '~/models/PurchaseModel';

const baseUrl = import.meta.server ? 'http://localhost:3000' : '';

export class PurchaseController {
    public items = reactive<PurchaseItem[]>([]);
    public filter = ref<'all' | 'done' | 'undone'>('all');

    constructor() {
        this.fetchItems();
    }

    async fetchItems() {
        try {
            const response = await fetch(`${baseUrl}/api/purchase-list`);
            const data = await response.json();
            this.items.splice(0, this.items.length, ...data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async addItem(text: string) {
        try {
            const response = await fetch('/api/purchase-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const newItem = await response.json();
            this.items.push(new PurchaseItem(newItem.id, newItem.text, newItem.completed));
        } catch (error) {
            console.error('Item add error:', error);
        }
    }

    async toggleItem(id: number) {
        try {
            const response = await fetch('/api/purchase-list', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const updatedItem = await response.json();
            const item = this.items.find((i) => i.id === updatedItem.id);
            if (item) item.completed = updatedItem.completed;
        } catch (error) {
            console.error('Item toggle error:', error);
        }
    }

    async removeItem(id: number) {
        try {
            await fetch('/api/purchase-list', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const index = this.items.findIndex((i) => i.id === id);
            if (index !== -1) this.items.splice(index, 1);
        } catch (error) {
            console.error('Item remove error:', error);
        }
    }

    async clearList() {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await fetch('/api/purchase-list/clear', { method: 'DELETE' });
            this.items.splice(0, this.items.length);
        } catch (error) {
            console.error('Error clearing list:', error);
        }
    }

    setFilter(filter: 'all' | 'done' | 'undone') {
        this.filter.value = filter;
    }

    getFilteredItems() {
        if (this.filter.value === 'done') {
            return this.items.filter((item) => item.completed);
        }
        if (this.filter.value === 'undone') {
            return this.items.filter((item) => !item.completed);
        }
        return this.items;
    }
}