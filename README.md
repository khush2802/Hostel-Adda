![image](https://github.com/user-attachments/assets/b9f84553-8bea-49fd-b1ed-3553184ccbc2)
# Hostel_Adda 🏠  
Hostel_Adda is a web application for listing and discovering hostels. Users can browse listings, publish their own with a photo and a location on a map, and review places they've stayed.  

## Features 🚀  
- **List Your Hostel:** Signed-in users can create listings with a photo (uploaded to Cloudinary) and a location (geocoded with Mapbox), and edit or delete their own listings.  
- **User Authentication:** Sign up, log in and log out with Passport (local strategy); sessions are stored in MongoDB.  
- **Ownership checks:** Only a listing's owner can edit or delete it, and only a review's author can delete that review. Listing and review forms are validated with Joi on the server.  
- **Map:** Each listing page shows its location on a Mapbox map.  
- **Reviews & Ratings:** Users can rate and review hostels.  
- **Responsive layout:** Built with Bootstrap 5.  

**Not built yet:** the search box in the navigation bar is a placeholder (listings aren't searchable or filterable), and there are no bookings.

## Technologies Used 🛠️  
- **Frontend:**  
  - EJS templates (ejs-mate layouts), HTML5, CSS3, JavaScript  
  - Bootstrap 5  
  - Font Awesome for icons  

- **Backend:**  
  - Node.js, Express.js  
  - Passport (passport-local-mongoose), express-session with connect-mongo  
  - Joi for request validation, Multer for uploads  

- **Database:**  
  - MongoDB (Mongoose for schema modeling)  

- **Other Integrations:**  
  - Mapbox API for geocoding and maps  
  - Cloudinary for image storage  

## Run it locally

```bash
npm install
cp .env.example .env   # fill in the values; SECRET should be at least 32 random characters
node app.js            # or: npm run dev
npm test               # node:test, no database needed
```

The app listens on port 8080. `.env.example` lists every variable it reads.

## FOLDER STRUCTURE
```plaintext
Hostel_Adda/  
├── public/    _______        # Static files (CSS, JS, images)  
├── routes/       _______       # Application routes  
├── views/        _______       # EJS templates  
├── models/        _______      # Database schemas  
├── controllers/    _______     # Request handlers and logic  
├── utils/          _______     # Utility functions (e.g., error handlers)  
├── test/           _______     # Tests (node:test)  
├── .env.example    _______     # Environment variable names (copy to .env)  
├── app.js          _______     # Main application file  
└── README.md        _______    # Project documentation  

```

There's no live demo at the moment: the earlier Render deployment is offline.
