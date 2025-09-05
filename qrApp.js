// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Determine initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme)) {
    document.body.classList.add("dark-mode");
    themeIcon.innerHTML =
      '<path d="M12 3v3a9 9 0 009 9h3v-3a12 12 0 00-12-12zm-4.95 2.121a8 8 0 010 11.314l-1.414 1.414a11 11 0 000-15.556l1.414 1.414zm5.657 5.657a5 5 0 01-7.071 0l-1.414 1.414a8 8 0 0011.314 0l-1.414-1.414zm-5.657 5.657a8 8 0 010-11.314l-1.414-1.414a11 11 0 0015.556 0l-1.414 1.414a8 8 0 01-11.314 11.314z" fill="currentColor"/>';
    themeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeIcon.innerHTML =
      '<path d="M21 13h-4v-4h4v4zm-6-2h-4v4h4v-4zm-6 6h-4v4h4v-4zm16-8.944A9 9 0 0017.944 3H14.98a6 6 0 01-5.96 0H5.056A9 9 0 003 11.056v1.888A9 9 0 005.056 21.002h3.964a6 6 0 015.96 0h3.964A9 9 0 0021 12.944v-1.888z" fill="currentColor"/>';
    themeToggle.textContent = "Dark Mode";
  }

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      themeIcon.innerHTML =
        '<path d="M21 13h-4v-4h4v4zm-6-2h-4v4h4v-4zm-6 6h-4v4h4v-4zm16-8.944A9 9 0 0017.944 3H14.98a6 6 0 01-5.96 0H5.056A9 9 0 003 11.056v1.888A9 9 0 005.056 21.002h3.964a6 6 0 015.96 0h3.964A9 9 0 0021 12.944v-1.888z" fill="currentColor"/>';
      themeToggle.textContent = "Dark Mode";
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      themeIcon.innerHTML =
        '<path d="M12 3v3a9 9 0 009 9h3v-3a12 12 0 00-12-12zm-4.95 2.121a8 8 0 010 11.314l-1.414 1.414a11 11 0 000-15.556l1.414 1.414zm5.657 5.657a5 5 0 01-7.071 0l-1.414 1.414a8 8 0 0011.314 0l-1.414-1.414zm-5.657 5.657a8 8 0 010-11.314l-1.414-1.414a11 11 0 0015.556 0l-1.414 1.414a8 8 0 01-11.314 11.314z" fill="currentColor"/>';
      themeToggle.textContent = "Light Mode";
    }
  });

  // Initialize JSPDF
  const { jsPDF } = window.jspdf;

  // Get DOM elements
  const dataInput = document.getElementById("dataInput");
  const generateBtn = document.getElementById("generateBtn");
  const qrCodeDiv = document.getElementById("qrCode");
  const startCameraBtn = document.getElementById("startCamera");
  const video = document.getElementById("video");
  const scanArea = document.getElementById("scanArea");
  const resultDiv = document.getElementById("result");

  const uploadLogoBtn = document.getElementById("uploadLogoBtn");
  const logoUpload = document.getElementById("logoUpload");
  const logoPreview = document.getElementById("logoPreview");
  const pdfPreview = document.getElementById("pdfPreview");
  const statusMessage = document.getElementById("statusMessage");

  let scanning = false;
  let qrCodeInterval;

  let logoDataUrl =
    "https://via.placeholder.com/150x100/4e54c8/ffffff?text=Your+Logo";

  // Handle logo upload
  uploadLogoBtn.addEventListener("click", function () {
    logoUpload.click();
  });

  logoUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        logoDataUrl = event.target.result;
        logoPreview.src = logoDataUrl;
        logoPreview.style.display = "block";
        document.querySelector(".placeholder-text").style.display = "none";
        showStatus("Logo uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  });

  // Show status message
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = "block";

    // Hide after 3 seconds
    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 3000);
  }

  // Generate PDF with QR code and logo
  generateBtn.addEventListener("click", function () {
    const data = dataInput.value.trim();
    if (!data) {
      showStatus("Please enter some data first", "error");
      return;
    }

    // Clear previous QR code
    qrCodeDiv.innerHTML = "";

    // Generate QR code
    const qrCode = new QRCode(qrCodeDiv, {
      text: data,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Give time for QR code to render
    setTimeout(() => {
      try {
        // Get QR code image data
        const canvas = qrCodeDiv.querySelector("canvas");
        const qrCodeDataUrl = canvas.toDataURL("image/png");

        // Create PDF
        const doc = new jsPDF();

        // Load and add logo to PDF
        const logoImg = new Image();

        logoImg.onload = function () {
          // Add background image first (so it's behind everything)
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          // Add background image (scaled to page size)
          doc.addImage(logoDataUrl, "PNG", 0, 0, pageWidth, pageHeight);

          // Calculate logo dimensions
          const logoAspectRatio = logoImg.width / logoImg.height;
          const logoWidth = 60;
          const logoHeight = logoWidth / logoAspectRatio;

          // Add logo to PDF (centered at top)
          const logoX = (pageWidth - logoWidth) / 2;
          doc.addImage(logoDataUrl, "PNG", logoX, 15, logoWidth, logoHeight);

          // Add title
          doc.setFontSize(22);
          doc.setTextColor(40, 40, 40);
          doc.text("Official Document", 105, 15 + logoHeight + 15, {
            align: "center",
          });

          // Add decorative line
          doc.setDrawColor(79, 84, 200);
          doc.setLineWidth(1);
          const lineY = 15 + logoHeight + 20;
          doc.line(40, lineY, 170, lineY);

          // Add data section header
          doc.setFontSize(16);
          doc.setTextColor(80, 80, 80);
          doc.text("Document Content:", 20, lineY + 15);

          // Add the data content
          doc.setFontSize(12);
          const splitText = doc.splitTextToSize(data, 170);
          doc.text(splitText, 20, lineY + 25);

          // Add QR code
          doc.addImage(
            qrCodeDataUrl,
            "PNG",
            70,
            lineY + 30 + splitText.length * 6,
            70,
            70
          );

          // Add instruction
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(
            "Scan the QR code to verify this document",
            105,
            lineY + 30 + splitText.length * 6 + 80,
            { align: "center" }
          );

          // Save the PDF
          doc.save("document-with-logo.pdf");

          // Update preview
          updatePdfPreview(data, qrCodeDataUrl, logoDataUrl);

          showStatus("PDF generated successfully!", "success");
        };

        logoImg.onerror = function () {
          showStatus("Error loading logo image", "error");
          // Continue without logo
          addContentToPdf(doc, data, qrCodeDataUrl, null);
        };

        logoImg.src = logoDataUrl;
      } catch (error) {
        console.error("Error generating PDF:", error);
        showStatus("Error generating PDF: " + error.message, "error");
      }
    }, 300);
  });

  // Function to add content to PDF (without logo)
  function addContentToPdf(doc, data, qrCodeDataUrl, logoInfo) {
    if (logoInfo) {
      doc.addImage(
        logoInfo.dataUrl,
        "PNG",
        logoInfo.x,
        logoInfo.y,
        logoInfo.width,
        logoInfo.height
      );
    }

    // Add title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(
      "Official Document",
      105,
      logoInfo ? logoInfo.y + logoInfo.height + 15 : 30,
      { align: "center" }
    );

    // Add decorative line
    doc.setDrawColor(79, 84, 200);
    doc.setLineWidth(1);
    const lineY = logoInfo ? logoInfo.y + logoInfo.height + 20 : 35;
    doc.line(40, lineY, 170, lineY);

    // Add data section header
    doc.setFontSize(16);
    doc.setTextColor(80, 80, 80);
    doc.text("Document Content:", 20, lineY + 15);

    // Add the data content
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(data, 170);
    doc.text(splitText, 20, lineY + 25);

    // Add QR code
    doc.addImage(
      qrCodeDataUrl,
      "PNG",
      70,
      lineY + 30 + splitText.length * 6,
      70,
      70
    );

    // Add instruction
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Scan the QR code to verify this document",
      105,
      lineY + 30 + splitText.length * 6 + 80,
      { align: "center" }
    );

    // Save the PDF
    doc.save("document-with-logo.pdf");

    // Update preview
    updatePdfPreview(data, qrCodeDataUrl, logoDataUrl);

    showStatus("PDF generated successfully!", "success");
  }

  // Function to update the PDF preview
  function updatePdfPreview(data, qrCodeDataUrl, logoUrl) {
    pdfPreview.innerHTML = `
                  <div style="text-align: center; padding: 20px; border: 1px solid var(--border-color); background: var(--bg-panel);">
                      <img src="${logoUrl}" alt="Logo" style="height: 60px; margin-bottom: 20px;">
                      <h2 style="color: var(--accent-primary); margin-bottom: 10px;">Official Document</h2>
                      <hr style="border-top: var(--line-border); margin-bottom: 20px; width: 80%; margin-left: auto; margin-right: auto;">
                      <h3 style="color: var(--text-primary); margin-bottom: 10px; text-align: left;">Document Content:</h3>
                      <p style="text-align: left; margin-bottom: 30px; white-space: pre-wrap;">${data}</p>
                      <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 150px; height: 150px; margin-bottom: 10px;">
                      <p style="color: var(--text-secondary); font-size: 12px;">Scan the QR code to verify this document</p>
                  </div>
            `;
  }

  // Sample data for demonstration
  dataInput.value =
    "Sample PDF Data:\n\nGenerated on: " +
    new Date().toLocaleString() +
    "\n\nThis is example data that will be encoded in the QR code and displayed when scanned.";

  // Start camera for QR code scanning
  startCameraBtn.addEventListener("click", function () {
    if (scanning) {
      // Stop camera
      stopCamera();
      startCameraBtn.textContent = "Start Camera";
      scanning = false;
    } else {
      // Start camera
      startCamera();
      startCameraBtn.textContent = "Stop Camera";
      scanning = true;
    }
  });

  // Function to start camera
  function startCamera() {
    // Request camera access
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required for mobile
        video.hidden = false;
        scanArea.style.display = "block";

        // Play the video
        video.play();

        // Start scanning for QR codes
        requestAnimationFrame(scanQRCode);
      })
      .catch(function (err) {
        console.error("Error accessing camera:", err);
        resultDiv.textContent = "Error accessing camera: " + err.message;
        showStatus("Error accessing camera: " + err.message, "error");
      });
  }

  // Function to stop camera
  function stopCamera() {
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }

    video.hidden = true;
    scanArea.style.display = "none";

    if (qrCodeInterval) {
      clearTimeout(qrCodeInterval);
    }
  }

  // Function to scan for QR codes
  function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Create canvas for image processing
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data from canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Try to decode QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      // If QR code found
      if (code) {
        // Draw box around QR code (for visualization)
        context.strokeStyle = "#4e54c8";
        context.lineWidth = 6;
        context.strokeRect(
          code.location.topLeftCorner.x,
          code.location.topLeftCorner.y,
          code.location.bottomRightCorner.x - code.location.topLeftCorner.x,
          code.location.bottomRightCorner.y - code.location.topLeftCorner.y
        );

        // Display result
        resultDiv.textContent = code.data;
        showStatus("QR code scanned successfully!", "success");
      }
    }

    // Continue scanning
    if (scanning) {
      qrCodeInterval = setTimeout(() => {
        requestAnimationFrame(scanQRCode);
      }, 500);
    }
  }
});
