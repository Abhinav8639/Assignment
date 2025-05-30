const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { scrapeBooks } = require('../scraper');

const Book = mongoose.model('Book');

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort = 'asc' } = req.query;
  try {
    let sortOption = {};
    if (sort === 'asc' || sort === 'desc') {
      sortOption = { price: sort === 'asc' ? 1 : -1 };
    }

    const books = await Book.find()
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Book.countDocuments();
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

router.post('/scrape', async (req, res) => {
  try {
    const books = await scrapeBooks();
    res.json({ message: 'Scraping complete', books });
  } catch (error) {
    res.status(500).json({ message: 'Scraping failed' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Book.deleteMany({});
    res.status(200).json({ message: 'All books deleted successfully' });
  } catch (error) {
    console.error('Error deleting books:', error);
    res.status(500).json({ error: 'Failed to delete books' });
  }
});

module.exports = router;