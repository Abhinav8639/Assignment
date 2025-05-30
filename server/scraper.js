const axios = require('axios');
  const cheerio = require('cheerio');
  const mongoose = require('mongoose');

  // Define Book schema
  const bookSchema = new mongoose.Schema({
    title: String,
    price: String,
    rating: String,
    createdAt: { type: Date, default: Date.now },
  });
  const Book = mongoose.model('Book', bookSchema);

  async function scrapeBooks() {
    try {
      const url = 'http://books.toscrape.com/';
      const { data } = await axios.get(url, {
        timeout: 10000, // 10-second timeout
      });
      console.log('Webpage fetched successfully');

      const $ = cheerio.load(data);
      const books = [];

      $('article.product_pod').each((_, element) => {
        const title = $(element).find('h3 a').attr('title') || 'Unknown Title';
        const price = $(element).find('.price_color').text() || 'Unknown Price';
        const rating = $(element).find('p.star-rating').attr('class')?.split(' ')[1] || 'Unknown Rating';
        books.push({ title, price, rating });
      });

      // Clear previous data and save new data
      await Book.deleteMany({});
      console.log('Existing books cleared');
      await Book.insertMany(books);
      console.log('Books saved to database:', books.length);

      return books;
    } catch (error) {
      console.error('Scraping error:', error.message);
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  module.exports = { scrapeBooks };