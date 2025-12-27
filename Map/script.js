// Main Application Script for Interactive Fantasy Map

document.addEventListener("DOMContentLoaded", function () {
  // ====================
  // Modal Functionality
  // ====================

  // Open modal when pin is clicked
  document.querySelectorAll(".pin").forEach((pin) => {
    pin.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal");
      const modal = document.getElementById(modalId);

      // Close any open modals first
      document.querySelectorAll(".modal.active").forEach((activeModal) => {
        activeModal.classList.remove("active");
      });

      // Show selected modal
      modal.classList.add("active");

      // Add active class to pin
      this.classList.add("active");

      // Optional: Play subtle sound effect
      playMapSound("click");
    });
  });

  // Close modal when X is clicked
  document.querySelectorAll(".modal-close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      const modal = this.closest(".modal");
      modal.classList.remove("active");

      // Remove active class from all pins
      document.querySelectorAll(".pin.active").forEach((pin) => {
        pin.classList.remove("active");
      });

      playMapSound("close");
    });
  });

  // Close modal when clicking outside content
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");

        // Remove active class from all pins
        document.querySelectorAll(".pin.active").forEach((pin) => {
          pin.classList.remove("active");
        });

        playMapSound("close");
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
      });

      // Remove active class from all pins
      document.querySelectorAll(".pin.active").forEach((pin) => {
        pin.classList.remove("active");
      });

      playMapSound("close");
    }
  });

  // ====================
  // Interactive Features
  // ====================

  // Add parchment texture effect to modals on hover
  document.querySelectorAll(".modal-section").forEach((section) => {
    section.addEventListener("mouseenter", function () {
      this.style.background = "rgba(193, 154, 107, 0.05)";
    });
    section.addEventListener("mouseleave", function () {
      this.style.background = "";
    });
  });

  // ====================
  // Utility Functions
  // ====================

  // Sound effects (optional, very subtle)
  function playMapSound(type) {
    // Base64 encoded silent audio (placeholder)
    // Replace with actual sound files if desired
    const silentAudio =
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

    try {
      const audio = new Audio(silentAudio);
      audio.volume = 0.1;

      if (type === "click") {
        // You could add different sounds here
        audio.play().catch((e) => console.log("Audio playback not essential"));
      } else if (type === "close") {
        audio.play().catch((e) => console.log("Audio playback not essential"));
      }
    } catch (error) {
      // Audio not essential, fail silently
    }
  }

  // ====================
  // Coordinate Helper Tool
  // ====================

  /**
   * Enable the coordinate helper tool
   * Uncomment the function call below to activate
   */
  enableCoordinateHelper();

  function enableCoordinateHelper() {
    const diagram = document.getElementById("diagram");

    if (!diagram) {
      console.error("Diagram image not found. Coordinate helper disabled.");
      return;
    }

    diagram.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = ((x / rect.width) * 100).toFixed(1);
      const percentY = ((y / rect.height) * 100).toFixed(1);

      // Display coordinates
      console.log("📍 Map Coordinates:");
      console.log(`   Pixels: ${x.toFixed(0)}px, ${y.toFixed(0)}px`);
      console.log(`   Percentage: ${percentX}%, ${percentY}%`);
      console.log(`   CSS: style="left: ${percentX}%; top: ${percentY}%;"`);

      // Try to copy to clipboard
      const cssCode = `style="left: ${percentX}%; top: ${percentY}%;"`;
      copyToClipboard(cssCode);

      // Create a temporary pin at click location
      createTemporaryPin(percentX, percentY);
    });

    console.log(
      "✅ Coordinate helper enabled. Click the map to get coordinates."
    );
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("✅ Coordinates copied to clipboard!"))
      .catch((err) =>
        console.log(
          "⚠️ Could not copy coordinates. You can copy manually from console."
        )
      );
  }

  function createTemporaryPin(x, y) {
    const pin = document.createElement("button");
    pin.className = "pin temporary-pin";
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
    pin.innerHTML = `
            <svg class="pin-icon" viewBox="0 0 24 24" fill="none" stroke="#a62323" stroke-width="2.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="pin-label">Click to remove</span>
        `;

    // Make the pin removable
    pin.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent triggering the coordinate helper
      this.remove();
      console.log("🗑️ Temporary pin removed");
    });

    document.querySelector(".diagram-wrapper").appendChild(pin);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (pin.parentNode) {
        pin.remove();
        console.log("⏰ Temporary pin auto-removed");
      }
    }, 10000);
  }
});
