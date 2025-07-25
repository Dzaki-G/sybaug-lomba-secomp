"use client";

export default function Footer() {
  return (
    <footer style={footerWrapper}>
      <div style={footerContent}>
        <p style={footerText}>
          © {new Date().getFullYear()} Badan Penanggulangan Bencana Provinsi Lampung. All rights reserved.
        </p>
        <div style={footerLinks}>
          <a href="#" style={footerLink}>Privacy Policy</a>
          <span style={divider}>|</span>
          <a href="#" style={footerLink}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

// === Styles ===

const footerWrapper = {
  width: "100%",
  padding: "1rem 0",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(8px)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#ffffff",
  fontFamily: '"Inter", sans-serif',
  fontSize: "0.875rem",
  marginTop: "2rem",
};

const footerContent = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  textAlign: "center",
};

const footerText = {
  margin: 0,
  opacity: 0.8,
};

const footerLinks = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  fontSize: "0.8rem",
};

const footerLink = {
  color: "#93c5fd",
  textDecoration: "none",
  transition: "color 0.3s ease",
};

const divider = {
  opacity: 0.5,
};
