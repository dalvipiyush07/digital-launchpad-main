# Cloud Build Admin Panel

Complete admin panel for managing Cloud Build website content.

## Features

✅ **Our Work Manager** - Add, edit, delete project portfolio items
✅ **Client Love Manager** - Manage testimonials with photos and ratings
✅ **Video Reviews Manager** - Add YouTube/Instagram video reviews
✅ **Image Uploads** - Upload and manage images for all content
✅ **Authentication** - Secure login system
✅ **Real-time Updates** - Changes reflect instantly on main site

## Setup Instructions

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Start Admin Server

```bash
npm start
```

Admin panel will run on: **http://localhost:8081**

### 3. Login Credentials

- **Email**: `admin@cloud.in`
- **Password**: `admin2107`

## File Structure

```
admin/
├── server.js           # Express server with API routes
├── package.json        # Dependencies
├── data/              # JSON data storage
│   ├── works.json     # Project portfolio data
│   ├── clients.json   # Testimonials data
│   └── videos.json    # Video reviews data
├── public/            # Frontend files
│   ├── login.html     # Login page
│   ├── dashboard.html # Admin dashboard
│   ├── styles.css     # Styling
│   ├── script.js      # Frontend logic
│   └── uploads/       # Uploaded images
└── routes/            # API route handlers (optional)
```

## API Endpoints

### Authentication
- `POST /api/login` - Login with credentials

### Our Work
- `GET /api/works` - Get all projects
- `POST /api/works` - Add new project
- `PUT /api/works/:id` - Update project
- `DELETE /api/works/:id` - Delete project

### Client Love
- `GET /api/clients` - Get all testimonials
- `POST /api/clients` - Add new testimonial
- `PUT /api/clients/:id` - Update testimonial
- `DELETE /api/clients/:id` - Delete testimonial

### Video Reviews
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Add new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

## Usage

### Adding a Project

1. Navigate to "Our Work" section
2. Click "+ Add New Project"
3. Fill in:
   - Upload thumbnail image
   - Project title
   - Category (e.g., E-commerce, SaaS)
   - Description
   - Live site URL
4. Click "Add Project"

### Adding a Testimonial

1. Navigate to "Client Love" section
2. Click "+ Add New Testimonial"
3. Fill in:
   - Upload client photo
   - Client name
   - Company/designation
   - Star rating (1-5)
   - Testimonial text
4. Click "Add Testimonial"

### Adding a Video Review

1. Navigate to "Video Reviews" section
2. Click "+ Add New Video"
3. Fill in:
   - Video type (YouTube/Instagram)
   - Video URL
   - Title
   - Upload thumbnail (optional)
4. Click "Add Video"

## Data Storage

All data is stored in JSON files in the `data/` folder:
- `works.json` - Project portfolio
- `clients.json` - Client testimonials
- `videos.json` - Video reviews

Images are stored in `public/uploads/` folder.

## Integration with Main Site

The main Cloud Build website (port 8080) reads data from these JSON files to display:
- Project portfolio in "Our Work" section
- Testimonials in "Client Love" section
- Video reviews in "Video Reviews" section

Changes made in the admin panel reflect instantly on the main site.

## Security

- Login required for all admin pages
- Session stored in localStorage
- Protected API routes
- File upload validation

## Troubleshooting

### Port Already in Use
If port 8081 is already in use, change the PORT in `server.js`:
```javascript
const PORT = 8082; // or any available port
```

### Images Not Loading
Make sure the `public/uploads/` directory exists and has write permissions.

### CORS Issues
The server is configured with CORS enabled. If you encounter issues, check the CORS configuration in `server.js`.

## Development

For development with auto-reload:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Production Deployment

1. Set environment variables for production
2. Use a process manager like PM2:
   ```bash
   pm2 start server.js --name cloudbuild-admin
   ```
3. Configure reverse proxy (nginx/Apache) if needed
4. Enable HTTPS for secure admin access

## Support

For issues or questions, contact the development team.

---

**Cloud Build Admin Panel v1.0**
