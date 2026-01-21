"use client"

import { useState } from "react"
import { Store, ExternalLink, TrendingDown, Star, Clock } from "lucide-react"

export default function GroceryComparePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const groceryPlatforms = [
    {
      name: "Blinkit",
      logo: "🛒",
      url: "https://blinkit.com",
      deliveryTime: "10-15 min",
      rating: 4.3,
      color: "bg-yellow-500"
    },
    {
      name: "Instamart",
      logo: "🏪",
      url: "https://www.swiggy.com/instamart",
      deliveryTime: "15-30 min",
      rating: 4.2,
      color: "bg-orange-500"
    },
    {
      name: "Zepto",
      logo: "⚡",
      url: "https://zepto.co.in",
      deliveryTime: "10 min",
      rating: 4.4,
      color: "bg-purple-500"
    },
    {
      name: "BigBasket",
      logo: "🧺",
      url: "https://www.bigbasket.com",
      deliveryTime: "2-6 hours",
      rating: 4.1,
      color: "bg-green-500"
    }
  ]

  const sampleItems = [
    // Vegetables
    { name: "Tomatoes (1kg)", category: "vegetables", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 40 }},
    { name: "Onions (1kg)", category: "vegetables", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 30 }},
    { name: "Potatoes (1kg)", category: "vegetables", prices: { "Blinkit": 28, "Instamart": 25, "Zepto": 30, "BigBasket": 24 }},
    { name: "Carrots (500g)", category: "vegetables", prices: { "Blinkit": 22, "Instamart": 20, "Zepto": 25, "BigBasket": 18 }},
    { name: "Spinach (250g)", category: "vegetables", prices: { "Blinkit": 15, "Instamart": 12, "Zepto": 18, "BigBasket": 10 }},
    { name: "Capsicum (500g)", category: "vegetables", prices: { "Blinkit": 55, "Instamart": 52, "Zepto": 58, "BigBasket": 48 }},
    { name: "Cauliflower (1pc)", category: "vegetables", prices: { "Blinkit": 38, "Instamart": 35, "Zepto": 42, "BigBasket": 32 }},
    { name: "Cabbage (1kg)", category: "vegetables", prices: { "Blinkit": 25, "Instamart": 22, "Zepto": 28, "BigBasket": 20 }},
    { name: "Brinjal (500g)", category: "vegetables", prices: { "Blinkit": 32, "Instamart": 28, "Zepto": 35, "BigBasket": 26 }},
    { name: "Okra (500g)", category: "vegetables", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Green Beans (500g)", category: "vegetables", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 28 }},
    { name: "Cucumber (500g)", category: "vegetables", prices: { "Blinkit": 18, "Instamart": 15, "Zepto": 20, "BigBasket": 14 }},
    
    // Meat & Fish
    { name: "Chicken Breast (500g)", category: "meat", prices: { "Blinkit": 220, "Instamart": 215, "Zepto": 225, "BigBasket": 210 }},
    { name: "Chicken Legs (500g)", category: "meat", prices: { "Blinkit": 180, "Instamart": 175, "Zepto": 185, "BigBasket": 170 }},
    { name: "Mutton (500g)", category: "meat", prices: { "Blinkit": 450, "Instamart": 440, "Zepto": 460, "BigBasket": 430 }},
    { name: "Fish - Rohu (500g)", category: "meat", prices: { "Blinkit": 180, "Instamart": 175, "Zepto": 185, "BigBasket": 170 }},
    { name: "Fish - Pomfret (500g)", category: "meat", prices: { "Blinkit": 320, "Instamart": 310, "Zepto": 330, "BigBasket": 300 }},
    { name: "Prawns (250g)", category: "meat", prices: { "Blinkit": 320, "Instamart": 310, "Zepto": 330, "BigBasket": 300 }},
    { name: "Eggs (12pcs)", category: "meat", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    
    // Staples
    { name: "Basmati Rice (1kg)", category: "staples", prices: { "Blinkit": 180, "Instamart": 175, "Zepto": 185, "BigBasket": 170 }},
    { name: "Regular Rice (1kg)", category: "staples", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    { name: "Wheat Flour (1kg)", category: "staples", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 40 }},
    { name: "Toor Dal (500g)", category: "staples", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 80 }},
    { name: "Moong Dal (500g)", category: "staples", prices: { "Blinkit": 95, "Instamart": 92, "Zepto": 98, "BigBasket": 88 }},
    { name: "Chana Dal (500g)", category: "staples", prices: { "Blinkit": 75, "Instamart": 72, "Zepto": 78, "BigBasket": 68 }},
    { name: "Cooking Oil (1L)", category: "staples", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Mustard Oil (1L)", category: "staples", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Sugar (1kg)", category: "staples", prices: { "Blinkit": 48, "Instamart": 45, "Zepto": 50, "BigBasket": 42 }},
    { name: "Salt (1kg)", category: "staples", prices: { "Blinkit": 22, "Instamart": 20, "Zepto": 25, "BigBasket": 18 }},
    { name: "Turmeric Powder (100g)", category: "staples", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 28 }},
    { name: "Red Chili Powder (100g)", category: "staples", prices: { "Blinkit": 42, "Instamart": 38, "Zepto": 45, "BigBasket": 35 }},
    
    // Dairy
    { name: "Milk (1L)", category: "dairy", prices: { "Blinkit": 65, "Instamart": 63, "Zepto": 66, "BigBasket": 62 }},
    { name: "Curd (400g)", category: "dairy", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 30 }},
    { name: "Paneer (200g)", category: "dairy", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 80 }},
    { name: "Butter (100g)", category: "dairy", prices: { "Blinkit": 55, "Instamart": 52, "Zepto": 58, "BigBasket": 50 }},
    { name: "Cheese Slice (200g)", category: "dairy", prices: { "Blinkit": 120, "Instamart": 115, "Zepto": 125, "BigBasket": 110 }},
    { name: "Ghee (500ml)", category: "dairy", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Cream (200ml)", category: "dairy", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    
    // Fruits
    { name: "Bananas (1kg)", category: "fruits", prices: { "Blinkit": 55, "Instamart": 52, "Zepto": 58, "BigBasket": 48 }},
    { name: "Apples (1kg)", category: "fruits", prices: { "Blinkit": 180, "Instamart": 175, "Zepto": 185, "BigBasket": 170 }},
    { name: "Oranges (1kg)", category: "fruits", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Grapes (500g)", category: "fruits", prices: { "Blinkit": 95, "Instamart": 90, "Zepto": 98, "BigBasket": 85 }},
    { name: "Mangoes (1kg)", category: "fruits", prices: { "Blinkit": 120, "Instamart": 115, "Zepto": 125, "BigBasket": 110 }},
    { name: "Pomegranate (500g)", category: "fruits", prices: { "Blinkit": 145, "Instamart": 140, "Zepto": 150, "BigBasket": 135 }},
    { name: "Papaya (1kg)", category: "fruits", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Watermelon (1kg)", category: "fruits", prices: { "Blinkit": 25, "Instamart": 22, "Zepto": 28, "BigBasket": 20 }},
    
    // Snacks & Packaged
    { name: "Bread (400g)", category: "snacks", prices: { "Blinkit": 28, "Instamart": 25, "Zepto": 30, "BigBasket": 24 }},
    { name: "Biscuits (200g)", category: "snacks", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 30 }},
    { name: "Chips (50g)", category: "snacks", prices: { "Blinkit": 20, "Instamart": 18, "Zepto": 22, "BigBasket": 16 }},
    { name: "Namkeen (200g)", category: "snacks", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 40 }},
    { name: "Noodles (Pack)", category: "snacks", prices: { "Blinkit": 15, "Instamart": 12, "Zepto": 18, "BigBasket": 10 }},
    { name: "Pasta (500g)", category: "snacks", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Oats (500g)", category: "snacks", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    
    // Beverages
    { name: "Tea (250g)", category: "beverages", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Coffee (200g)", category: "beverages", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Soft Drink (1L)", category: "beverages", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Fruit Juice (1L)", category: "beverages", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    
    // Personal Care
    { name: "Toothpaste (100g)", category: "personal", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    { name: "Shampoo (200ml)", category: "personal", prices: { "Blinkit": 145, "Instamart": 140, "Zepto": 150, "BigBasket": 135 }},
    { name: "Soap (100g)", category: "personal", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 28 }},
    { name: "Face Wash (100ml)", category: "personal", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    
    // Household
    { name: "Detergent (1kg)", category: "household", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Dish Soap (500ml)", category: "household", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Toilet Paper (4 rolls)", category: "household", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    { name: "Kitchen Towels (2 rolls)", category: "household", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Floor Cleaner (1L)", category: "household", prices: { "Blinkit": 145, "Instamart": 140, "Zepto": 150, "BigBasket": 135 }},
    { name: "Glass Cleaner (500ml)", category: "household", prices: { "Blinkit": 95, "Instamart": 92, "Zepto": 98, "BigBasket": 88 }},
    { name: "Air Freshener (300ml)", category: "household", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Garbage Bags (30pcs)", category: "household", prices: { "Blinkit": 75, "Instamart": 72, "Zepto": 78, "BigBasket": 68 }},
    
    // More Vegetables
    { name: "Beetroot (500g)", category: "vegetables", prices: { "Blinkit": 28, "Instamart": 25, "Zepto": 30, "BigBasket": 22 }},
    { name: "Radish (500g)", category: "vegetables", prices: { "Blinkit": 22, "Instamart": 18, "Zepto": 25, "BigBasket": 16 }},
    { name: "Ginger (200g)", category: "vegetables", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Garlic (250g)", category: "vegetables", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    { name: "Green Chili (100g)", category: "vegetables", prices: { "Blinkit": 15, "Instamart": 12, "Zepto": 18, "BigBasket": 10 }},
    { name: "Coriander (100g)", category: "vegetables", prices: { "Blinkit": 12, "Instamart": 10, "Zepto": 15, "BigBasket": 8 }},
    { name: "Mint (100g)", category: "vegetables", prices: { "Blinkit": 15, "Instamart": 12, "Zepto": 18, "BigBasket": 10 }},
    { name: "Lemon (250g)", category: "vegetables", prices: { "Blinkit": 25, "Instamart": 22, "Zepto": 28, "BigBasket": 18 }},
    
    // More Fruits
    { name: "Pineapple (1pc)", category: "fruits", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Kiwi (4pcs)", category: "fruits", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    { name: "Dragon Fruit (1pc)", category: "fruits", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Avocado (2pcs)", category: "fruits", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Strawberry (250g)", category: "fruits", prices: { "Blinkit": 145, "Instamart": 140, "Zepto": 150, "BigBasket": 135 }},
    { name: "Blueberry (125g)", category: "fruits", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Coconut (1pc)", category: "fruits", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 28 }},
    
    // More Meat & Seafood
    { name: "Chicken Wings (500g)", category: "meat", prices: { "Blinkit": 195, "Instamart": 190, "Zepto": 200, "BigBasket": 185 }},
    { name: "Pork (500g)", category: "meat", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Fish - Salmon (300g)", category: "meat", prices: { "Blinkit": 385, "Instamart": 380, "Zepto": 390, "BigBasket": 375 }},
    { name: "Crab (500g)", category: "meat", prices: { "Blinkit": 485, "Instamart": 480, "Zepto": 490, "BigBasket": 475 }},
    { name: "Squid (300g)", category: "meat", prices: { "Blinkit": 245, "Instamart": 240, "Zepto": 250, "BigBasket": 235 }},
    
    // More Dairy
    { name: "Greek Yogurt (200g)", category: "dairy", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Mozzarella (200g)", category: "dairy", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Cottage Cheese (250g)", category: "dairy", prices: { "Blinkit": 95, "Instamart": 92, "Zeoto": 98, "BigBasket": 88 }},
    { name: "Condensed Milk (400g)", category: "dairy", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    
    // More Staples & Spices
    { name: "Quinoa (500g)", category: "staples", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Brown Rice (1kg)", category: "staples", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    { name: "Cumin Seeds (100g)", category: "staples", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    { name: "Coriander Seeds (100g)", category: "staples", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Garam Masala (50g)", category: "staples", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Black Pepper (50g)", category: "staples", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    { name: "Cardamom (25g)", category: "staples", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Cinnamon (50g)", category: "staples", prices: { "Blinkit": 95, "Instamart": 92, "Zepto": 98, "BigBasket": 88 }},
    { name: "Bay Leaves (10g)", category: "staples", prices: { "Blinkit": 25, "Instamart": 22, "Zepto": 28, "BigBasket": 18 }},
    { name: "Sesame Oil (500ml)", category: "staples", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Coconut Oil (500ml)", category: "staples", prices: { "Blinkit": 145, "Instamart": 140, "Zepto": 150, "BigBasket": 135 }},
    { name: "Honey (250g)", category: "staples", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Jaggery (500g)", category: "staples", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    
    // More Snacks & Packaged
    { name: "Cornflakes (500g)", category: "snacks", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Muesli (500g)", category: "snacks", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Granola (400g)", category: "snacks", prices: { "Blinkit": 385, "Instamart": 380, "Zepto": 390, "BigBasket": 375 }},
    { name: "Crackers (200g)", category: "snacks", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    { name: "Popcorn (100g)", category: "snacks", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Nuts Mix (200g)", category: "snacks", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Almonds (250g)", category: "snacks", prices: { "Blinkit": 385, "Instamart": 380, "Zepto": 390, "BigBasket": 375 }},
    { name: "Cashews (250g)", category: "snacks", prices: { "Blinkit": 485, "Instamart": 480, "Zepto": 490, "BigBasket": 475 }},
    { name: "Raisins (250g)", category: "snacks", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Dark Chocolate (100g)", category: "snacks", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    
    // More Beverages
    { name: "Green Tea (25 bags)", category: "beverages", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    { name: "Energy Drink (250ml)", category: "beverages", prices: { "Blinkit": 65, "Instamart": 62, "Zepto": 68, "BigBasket": 58 }},
    { name: "Coconut Water (200ml)", category: "beverages", prices: { "Blinkit": 35, "Instamart": 32, "Zepto": 38, "BigBasket": 28 }},
    { name: "Sports Drink (500ml)", category: "beverages", prices: { "Blinkit": 45, "Instamart": 42, "Zepto": 48, "BigBasket": 38 }},
    { name: "Protein Shake (250ml)", category: "beverages", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Mineral Water (1L)", category: "beverages", prices: { "Blinkit": 25, "Instamart": 22, "Zepto": 28, "BigBasket": 18 }},
    
    // More Personal Care
    { name: "Deodorant (150ml)", category: "personal", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Body Lotion (200ml)", category: "personal", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Sunscreen (100ml)", category: "personal", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Hair Oil (200ml)", category: "personal", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    { name: "Razor (Pack of 3)", category: "personal", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Moisturizer (100ml)", category: "personal", prices: { "Blinkit": 245, "Instamart": 240, "Zepto": 250, "BigBasket": 235 }},
    
    // Baby Care
    { name: "Baby Diapers (20pcs)", category: "baby", prices: { "Blinkit": 485, "Instamart": 480, "Zepto": 490, "BigBasket": 475 }},
    { name: "Baby Wipes (80pcs)", category: "baby", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Baby Shampoo (200ml)", category: "baby", prices: { "Blinkit": 165, "Instamart": 160, "Zepto": 170, "BigBasket": 155 }},
    { name: "Baby Food (200g)", category: "baby", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    
    // Pet Care
    { name: "Dog Food (1kg)", category: "pet", prices: { "Blinkit": 385, "Instamart": 380, "Zepto": 390, "BigBasket": 375 }},
    { name: "Cat Food (400g)", category: "pet", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Pet Treats (200g)", category: "pet", prices: { "Blinkit": 125, "Instamart": 120, "Zepto": 130, "BigBasket": 115 }},
    
    // Frozen Foods
    { name: "Frozen Peas (500g)", category: "frozen", prices: { "Blinkit": 85, "Instamart": 82, "Zepto": 88, "BigBasket": 78 }},
    { name: "Ice Cream (500ml)", category: "frozen", prices: { "Blinkit": 185, "Instamart": 180, "Zepto": 190, "BigBasket": 175 }},
    { name: "Frozen Chicken (1kg)", category: "frozen", prices: { "Blinkit": 285, "Instamart": 280, "Zepto": 290, "BigBasket": 275 }},
    { name: "Frozen Pizza (300g)", category: "frozen", prices: { "Blinkit": 245, "Instamart": 240, "Zepto": 250, "BigBasket": 235 }}
  ]

  const categories = [
    { id: "all", name: "All Items" },
    { id: "vegetables", name: "Vegetables" },
    { id: "fruits", name: "Fruits" },
    { id: "meat", name: "Meat & Fish" },
    { id: "dairy", name: "Dairy" },
    { id: "staples", name: "Staples" },
    { id: "snacks", name: "Snacks" },
    { id: "beverages", name: "Beverages" },
    { id: "personal", name: "Personal Care" },
    { id: "household", name: "Household" },
    { id: "baby", name: "Baby Care" },
    { id: "pet", name: "Pet Care" },
    { id: "frozen", name: "Frozen Foods" }
  ]

  const filteredItems = sampleItems.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  ).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getBestPrice = (prices) => {
    const minPrice = Math.min(...Object.values(prices))
    return Object.entries(prices).find(([_, price]) => price === minPrice)
  }

  const openPlatform = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Store className="h-10 w-10 text-green-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🛒 Grocery Price Comparison
              </h1>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Compare prices across all major grocery platforms
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search groceries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 hover:bg-green-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {groceryPlatforms.map((platform) => (
            <div key={platform.name} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${platform.color} rounded-xl text-2xl`}>
                    {platform.logo}
                  </div>
                  <div>
                    <h3 className="font-bold">{platform.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {platform.rating}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openPlatform(platform.url)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{platform.deliveryTime}</span>
              </div>
              
              <button
                onClick={() => openPlatform(platform.url)}
                className={`w-full ${platform.color} text-white py-2 rounded-lg hover:scale-105 transition-all`}
              >
                Shop Now
              </button>
            </div>
          ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-green-600" />
              Price Comparison
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">Item</th>
                  {groceryPlatforms.map((platform) => (
                    <th key={platform.name} className="px-4 py-4 text-center">{platform.name}</th>
                  ))}
                  <th className="px-6 py-4 text-center">Best Deal</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.slice(0, 25).map((item, idx) => {
                  const [bestPlatform, bestPrice] = getBestPrice(item.prices)
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      {groceryPlatforms.map((platform) => {
                        const price = item.prices[platform.name]
                        const isBest = price === bestPrice
                        return (
                          <td key={platform.name} className="px-4 py-4 text-center">
                            <span className={`px-3 py-1 rounded-lg ${
                              isBest ? "bg-green-100 text-green-700 border-2 border-green-500" : "bg-gray-100"
                            }`}>
                              ₹{price}
                            </span>
                          </td>
                        )
                      })}
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-600 font-bold">
                          {bestPlatform} - ₹{bestPrice}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredItems.length > 25 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Showing 25 of {filteredItems.length} items. Use search and category filters to find specific products.
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}