import { useState } from 'react';
import { createItem } from '../api';
export default function ItemForm({ onItemAdded }) {
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');
setSuccess('');
try {
await createItem({ name, description, price: Number(price) });
setName('');
setDescription('');
setPrice('');
setSuccess('Item added successfully!');
setTimeout(() => setSuccess(''), 3000);
onItemAdded();
} catch (err) {
setError('Failed to add item: ' + (err.response?.data?.message || err.message));
}
finally {
setLoading(false);
}
};
return (
<form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
<h2>Add New Item</h2>
{error && <p style={{ color: 'red' }}>{error}</p>}
{success && <p style={{ color: 'green' }}>{success}</p>}
<div>
<input
placeholder="Item name"
value={name}
onChange={e => setName(e.target.value)}
required
/>
</div>
<div>
<input
placeholder="Description"
value={description}
onChange={e => setDescription(e.target.value)}
required
/>
</div>
<div>
<input
placeholder="Price (e.g. 29.99)"
type="number"
value={price}
onChange={e => setPrice(e.target.value)}
required
/>
</div>
<button type="submit" disabled={loading}>
{loading ? 'Adding...' : 'Add Item'}
</button>
</form>
);
}