# PDF Generator with QR Code & Logo

### Project Screenshots

![alt text](<images/Screenshot (48).png>)

![alt text](<images/Screenshot (49).png>)

![alt text](<images/Screenshot (50).png>)

A web application that generates professional PDF documents with embedded QR codes and custom logos. The application allows users to create documents with their content, add a logo, and generate a QR code that encodes the document content. It also includes a QR code scanner to verify the generated documents.

## Features

1. 📄 **PDF Generation**: Create professional PDF documents with custom content
2. 🔍 **QR Code Integration**: Generate QR codes that encode document content
3. 🖼️ **Logo Customization**: Add your company logo to documents
4. 🌓 **Light & Dark Mode**: Switch between light and dark themes
5. 📱 **Mobile-Friendly**: Responsive design works on all devices
6. 📷 **QR Code Scanner**: Scan QR codes using device camera
7. 🖨️ **Document Preview**: See how your document will look before saving 3.

## How to Use

### Enter Document Content:

Type or paste your document content in the text area
The content will be encoded in the QR code

#### Add Your Logo:

- Click "Upload Logo" to add your company logo
- Supported formats: PNG, JPG

#### Generate PDF:

- Click "Generate PDF" to create your document
- The PDF will download automatically

#### Verify Documents:

- Click "Start Camera" to activate the QR code scanner
- Point your camera at a generated QR code to verify its content

#### Switch Themes:

- Click the "Dark Mode"/"Light Mode" button in the header
- Your preference is saved for future visits

## Installation & Setup

This is a client-side web application that runs directly in your browser. No installation is required!

### Option 1: Run Directly from HTML File

Save the HTML file to your computer
Double-click the file to open it in your browser

- Note: Some browsers may block local file access for security reasons

### Option 2: Run with a Local Server (Recommended)

For best results and to avoid CORS issues with local images:

1. Install a simple HTTP server:

   > npm install -g http-server

2. Navigate to your project directory:

   > cd path/to/your/project

3. Start the server:

   > http-server

4. Open your browser and go to:
   > http://localhost:8080

## Dependencies

This project uses the following libraries:

- jsPDF - PDF generation library
- QRCode.js - QR code generation
- jsQR - QR code scanning
- Font Awesome - Icons (via CDN)

## Technical Notes

### CORS Issues with Local Images

When running the application directly from a file (file:// protocol), browsers block local image access due to CORS policies. To resolve this:

1. **Recommended**: Use a local development server (as described above)
2. **Alternative**: Convert your logo to Base64 format and embed it directly in your code

### Image Handling

The application handles images in two ways:

1. **Base64 Images**: Works perfectly without CORS issues
2. **Static Image Files**: Requires running through a server to avoid CORS errors

### Contributing

Contributions are welcome! Please follow these steps:

Fork the repository

1. Create your feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

### License

Distributed under the MIT License. See LICENSE for more information.

© 2023 PDF Generator with QR Code & Logo. All rights reserved.
