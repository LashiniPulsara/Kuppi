const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// In-memory fallback storage
let mockItems = [];
let mockIdCounter = 1;

// Helper to generate mock IDs
function generateMockId() {
  return (mockIdCounter++).toString();
}

// GET all items
router.get('/', async (req, res) => {
   try {
     const items = await Item.find();
     res.json(items);
    } catch (err) {
       console.log('Using mock data due to DB error:', err.message);
       res.json(mockItems);
}
});

// POST create item
router.post('/', async (req, res) => {
const item = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,   
});

try {
const newItem = await item.save();
res.status(201).json(newItem);
} catch (err) {
   console.log('Using mock data for POST due to DB error:', err.message);
   const mockItem = {
     _id: generateMockId(),
     name: req.body.name,
     description: req.body.description,
     price: req.body.price
   };
   mockItems.push(mockItem);
   res.status(201).json(mockItem);
}
});

// DELETE item
router.delete('/:id', async (req, res) => {
try {
await Item.findByIdAndDelete(req.params.id);
res.json({ message: 'Item deleted' });
} catch (err) {
   console.log('Using mock data for DELETE due to DB error');
   mockItems = mockItems.filter(item => item._id !== req.params.id);
   res.json({ message: 'Item deleted' });
}
});

// PUT update item
router.put('/:id', async (req, res) => {
try {
const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);
} catch (err) {
   console.log('Using mock data for PUT due to DB error');
   const itemIndex = mockItems.findIndex(item => item._id === req.params.id);
   if (itemIndex >= 0) {
     mockItems[itemIndex] = { ...mockItems[itemIndex], ...req.body };
     res.json(mockItems[itemIndex]);
   } else {
     res.status(404).json({ message: 'Item not found' });
   }
}
});

module.exports = router;