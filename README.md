# Cloud-Based Web Admin Panel with Scraped Books Data

## 🌐 Live Demo
https://scrapper-68xp.onrender.com

## 📚 Project Overview

This project is a cloud-hosted admin panel that scrapes **book data** from [Books to Scrape](http://books.toscrape.com), stores it in a cloud database, and displays it on a dashboard.

### Features:
✅ Scrape book titles, prices, and details on demand using **Cheerio**  
✅ Store scraped data in **MongoDB Atlas**  
✅ View data in a table with **pagination, sorting, and delete** options  
✅ Simple admin login/authentication  
✅ Fully deployed on a cloud platform (**Render / Railway / Vercel**)

---

## 🛠️ Tech Stack

- **Frontend:** React + Bootstrap (admin panel UI)
- **Backend:** Node.js + Express  
- **Scraper:** Cheerio (server-side web scraper)
- **Database:** MongoDB Atlas (cloud MongoDB)
- **Deployment:** [Platform you used, e.g., Render, Railway, Vercel]

---

## ⚙️ How It Works

1. **Login to Admin Panel** → dummy or Firebase auth  
2. **Click "Scrape Now" Button** → triggers backend endpoint  
3. **Backend Scraper Runs** → uses Cheerio to fetch book data from [Books to Scrape](http://books.toscrape.com)  
4. **Store Data in Database** → MongoDB Atlas collection  
5. **View Data Table** → frontend fetches data, displays in sortable, paginated table  
6. **Delete Functionality** → remove unwanted records from the table

---

## 📦 Setup Instructions (Local)

1. Clone this repo:
2.npm install in client and server
3.npm run dev 
4.node index.js
